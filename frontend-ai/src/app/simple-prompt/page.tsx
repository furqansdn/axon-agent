"use client";

import { CornerDownLeft, Paperclip } from "lucide-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from "@/components/system/header";
import { set } from "zod";

interface Message {
  role: string;
  content: string;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);

  const [role, setRole] = useState("system");
  const [messageInput, setMessageInput] = useState("");

  const onChange = (value: string, type: "message" | "role") => {
    if (type === "message") {
      setMessageInput(value);
    }

    if (type === "role") {
      setRole(value);
    }
  };

  useEffect(() => {
    const indexMessages = messages.findIndex(
      (message) => message.role === role
    );

    if (indexMessages === -1) {
      setMessages((prev) => [...prev, { role, content: messageInput }]);
    } else {
      //remove data by index
      setMessages(messages.filter((x) => x.role !== role));
      setMessages((prev) => [...prev, { role, content: messageInput }]);
    }
  }, [messageInput]);

  useEffect(() => {
    const indexMessages = messages.findIndex(
      (message) => message.role === role
    );

    if (indexMessages === -1) {
      console.log("tidak ketemu");
      setMessageInput("");
    } else {
      console.log("ketemu");
      setMessageInput(messages[indexMessages].content);
    }
  }, [role]);

  return (
    <>
      <Header title="Simple Prompt Playground"></Header>
      <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="relative hidden flex-col items-start gap-8 md:flex"
          x-chunk="dashboard-03-chunk-0"
        >
          <form className="grid w-full items-start gap-6">
            <fieldset className="grid gap-6 rounded-lg border p-4">
              <legend className="-ml-1 px-1 text-sm font-medium">
                Messages
              </legend>
              <div className="grid gap-3">
                <Label htmlFor="role">Role</Label>
                <Select
                  defaultValue="system"
                  onValueChange={(value) => onChange(value, "role")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="You are a..."
                  className="min-h-[9.5rem]"
                  onChange={(e) => onChange(e.target.value, "message")}
                  value={messageInput}
                />
              </div>
            </fieldset>
          </form>
        </div>
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
          <Badge variant="outline" className="absolute right-3 top-3">
            Output
          </Badge>
          <div className="flex-1" />
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
            />
            <div className="flex items-center p-3 pt-0">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Paperclip className="size-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach File</TooltipContent>
              </Tooltip>

              <Button type="submit" size="sm" className="ml-auto gap-1.5">
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
