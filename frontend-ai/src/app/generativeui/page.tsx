"use client";

import { useActions } from "@/utils/client";
import { EndpointsContext } from "../agent";
import { useState } from "react";
import { HumanMessageText } from "@/components/prebuild/message";
import { LocalContext } from "../shared";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function GenerativeUI() {
  const actions = useActions<typeof EndpointsContext>();

  const [elements, setElements] = useState<JSX.Element[]>([]);
  const [history, setHistory] = useState<[role: string, content: string][]>([]);
  const [input, setInput] = useState("");

  async function onSubmit(input: string) {
    const newElements = [...elements];

    const element = await actions.agent({
      input,
      chat_history: history,
    });

    newElements.push(
      <div className="flex flex-col w-full gap-1 mt-auto" key={history.length}>
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
  }

  return (
    <main className="flex h-screen flex-col items-center justify-between px-24">
      <div className="w-full min-w-[600px] flex flex-col gap-4">
        <LocalContext.Provider value={onSubmit}>
          <div className="flex flex-col w-full gap-1 mt-auto">{elements}</div>
        </LocalContext.Provider>
        <form
          onSubmit={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await onSubmit(input);
          }}
          className="w-full flex flex-row gap-2"
        >
          <Input
            placeholder="What's the weather like in San Francisco?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </main>
  );
}
