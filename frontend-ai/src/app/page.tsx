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
      "http://localhost:8000/agent/virtual-assistant",
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
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed  left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <Triangle className="size-5 fill-foreground" />
          </Button>
        </div>
        <nav className="grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg bg-muted"
                aria-label="Playground"
              >
                <SquareTerminal className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Playground
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Models"
              >
                <Bot className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Models
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="API"
              >
                <Code2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              API
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Documentation"
              >
                <Book className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Documentation
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-lg"
                aria-label="Settings"
              >
                <Settings2 className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Settings
            </TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto grid gap-1 p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Help"
              >
                <LifeBuoy className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Help
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="mt-auto rounded-lg"
                aria-label="Account"
              >
                <SquareUser className="size-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={5}>
              Account
            </TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Agent Playground</h1>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3 overflow-y-auto">
            <Badge variant="outline" className="absolute right-3 top-3">
              Output
            </Badge>
            <div className="mt-6 overflow-y-scroll flex-1">
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
      </div>
    </div>
  );
}
