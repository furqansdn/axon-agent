import React from "react";

const Header = ({ title }: { title: string }) => {
  return (
    <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 className="text-xl font-semibold">{title}</h1>
    </header>
  );
};

export default Header;
