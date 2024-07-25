import React from "react";
import { Book, Bot, Code2, Settings2, SquareTerminal } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="grid gap-1 p-2">
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/chaining">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg bg-muted"
              aria-label="Chaining"
            >
              <SquareTerminal className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Chaining
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Models"
            >
              <Bot className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Agent
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/axon">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Generative UI"
            >
              <Code2 className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Generative UI
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/simple-prompt">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-lg"
              aria-label="Settings"
            >
              <Settings2 className="size-5" />
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right" sideOffset={5}>
          Simple Prompt Playground
        </TooltipContent>
      </Tooltip>
    </nav>
  );
};

export default Navbar;
