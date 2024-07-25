"use client";

import React, { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CornerDownLeft, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActions } from "@/utils/client";
import { EndpointsContext } from "@/app/agent";
import { HumanMessageText } from "./message";
import { LocalContext } from "@/app/shared";
import { Input } from "../ui/input";
import { convertFileToBase64 } from "@/utils/converFiletoBase64";

function FileUploadMessage({ file }: { file: File }) {
  return (
    <div className="flex items-center gap-2 ml-auto flex-col w-[300px] p-2">
      <img src={URL.createObjectURL(file)} />
      <div className="flex">
        <Paperclip className="size-4" />
        <span className="text-muted-foreground">{file.name}</span>
      </div>
    </div>
  );
}

const Chat = () => {
  const actions = useActions<typeof EndpointsContext>();

  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [history, setHistory] = useState<[role: string, content: string][]>([]);
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const triggerFileInput = () => {
    fileInputRef?.current?.click();
  };

  async function onSubmit(input: string) {
    const newElements = [...elements];
    let base64File: string | undefined = undefined;

    let fileExtension = selectedFile?.type.split("/")[1];

    if (selectedFile) {
      base64File = await convertFileToBase64(selectedFile);
    }

    const element = await actions.agent({
      input,
      chat_history: history,
      file:
        base64File && fileExtension
          ? { base64: base64File, extension: fileExtension }
          : undefined,
    });

    newElements.push(
      <div className="flex flex-col w-full gap-1 mt-auto" key={history.length}>
        {selectedFile && <FileUploadMessage file={selectedFile} />}
        <HumanMessageText content={input} />
        <div className="flex flex-col gap-1 w-full max-w-fit mr-auto">
          {element.ui}
        </div>
      </div>
    );

    (async () => {
      let lastEvent = await element.lastEvent;

      if (typeof lastEvent === "object") {
        if (lastEvent["invokeModel"]["result"]) {
          setHistory((prev) => [
            ...prev,
            ["user", input],
            ["assistant", lastEvent["invokeModel"]["result"]],
          ]);
        } else if (lastEvent["invokeTools"]) {
          setHistory((prev) => [
            ...prev,
            ["user", input],
            [
              "assistant",
              `Tool result: ${JSON.stringify(
                lastEvent["invokeTools"]["toolResult"],
                null
              )}`,
            ],
          ]);
        } else {
          console.log("ELSE!", lastEvent);
        }
      }
    })();
    setElements(newElements);
    setInput("");
    setSelectedFile(null);
  }

  return (
    <>
      <div className="flex-1 mt-5">
        <ScrollArea className="flex-1 p-4 h-[480px]">
          {/* Chat messages would go here */}
          <div className="space-y-4">
            <LocalContext.Provider value={onSubmit}>
              <div className="flex flex-col w-full gap-1 mt-auto">
                {elements}
              </div>
            </LocalContext.Provider>
          </div>
        </ScrollArea>
      </div>
      <form
        onSubmit={async (e) => {
          e.stopPropagation();
          e.preventDefault();
          await onSubmit(input);
        }}
        className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
          placeholder="Type your message here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="flex items-center p-3 pt-0">
          <div>
            <Input
              id="file"
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
            />

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      triggerFileInput();
                    }}
                  >
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                  {selectedFile && (
                    <Input
                      readOnly
                      placeholder="No file chosen"
                      value={selectedFile?.name}
                      className="flex-grow"
                    />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="top">Attach File</TooltipContent>
            </Tooltip>
          </div>

          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </>
  );
};

export default Chat;
