"use client";

import {
  Book,
  Bot,
  Code2,
  CornerDownLeft,
  LifeBuoy,
  Settings2,
  SquareTerminal,
  SquareUser,
  Triangle,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import axios from "axios";
import Header from "@/components/system/header";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Dashboard() {
  const [message, setMessage] = useState("");
  const [listMessages, setListMessages] = useState<
    {
      message: string;
      type: "sender" | "receiver";
    }[]
  >([{ message: "Hello, how can I help you?", type: "receiver" }]);

  const [typing, setTyping] = useState(false);

  const submitMessage = async (e: any) => {
    e.preventDefault();
    setListMessages((prev) => [...prev, { message, type: "sender" }]);

    setMessage("");

    setTyping(true);
    const axiosResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/agent/virtual-assistant`,
      {
        query: message,
      }
    );
    setTyping(false);

    setListMessages((prev) => [
      ...prev,
      { message: axiosResponse.data.output, type: "receiver" },
    ]);
  };
  return (
    <>
      <Header title="Playground Agent"></Header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3 overflow-y-auto">
          <Badge variant="outline" className="absolute right-3 top-3">
            Output
          </Badge>
          <div className="mt-6 overflow-y-scroll flex-1">
            <ScrollArea className="flex-1 p-4 h-[480px]">
              {listMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-2 mt-2 ${
                    msg.type === "sender" ? "justify-end" : ""
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      msg.type === "sender"
                        ? `bg-primary dark:text-black text-white`
                        : "bg-background"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>
          {/* 
            {typing && (
              <div className="flex gap-2 mt-2 justify-end">
                <div className="p-2 rounded-lg bg-primary text-white">...</div>
              </div>
            )} */}
          <form
            className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
            x-chunk="dashboard-03-chunk-1"
          >
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center p-3 pt-0">
              <Button
                type="submit"
                size="sm"
                className="ml-auto gap-1.5"
                onClick={submitMessage}
              >
                Send Message
                <CornerDownLeft className="size-3.5" />
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
