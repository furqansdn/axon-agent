import React from "react";
import Header from "@/components/system/header";
import { Badge } from "@/components/ui/badge";
import Chat from "@/components/prebuild/chat";

const Page = () => {
  return (
    <>
      <Header title="CIST AI Assistant" />
      <main className="grid  flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3">
          <Badge variant="outline" className="absolute right-3 top-3">
            Output
          </Badge>
          <Chat />
        </div>
        {/* <div className="relative bg-red-200 flex h-full xs:hidden"></div> */}
      </main>
    </>
  );
};

export default Page;
