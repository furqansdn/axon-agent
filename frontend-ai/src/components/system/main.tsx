import { BrainCog } from "lucide-react";

import React from "react";
import { Button } from "../ui/button";
import Navbar from "./navbar";

const MainComponent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="grid h-screen w-full pl-[56px]">
      <aside className="inset-y fixed left-0 z-20 flex h-full flex-col border-r">
        <div className="border-b p-2">
          <Button variant="outline" size="icon" aria-label="Home">
            <BrainCog className="size-5" strokeWidth={2.75} />
          </Button>
        </div>
        <Navbar />
      </aside>

      <div className="flex flex-col">{children}</div>
    </div>
  );
};

export default MainComponent;
