// components/LightListener.tsx
"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io(`${process.env.NEXT_PUBLIC_API_URL}`); // Replace with your NestJS server URL

const ThemeListener = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [lightStatus, setLightStatus] = useState<boolean>();
  const { setTheme } = useTheme();

  useEffect(() => {
    const state = localStorage.getItem("lightStatus") === "true" ? true : false;
    setLightStatus(state);
  }, []);

  useEffect(() => {
    // Connect to the WebSocket server

    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    // Listen for the 'light' event
    socket.on("light", (data) => {
      console.log("Received light event:", data);
      localStorage.setItem("lightStatus", data);
      setLightStatus(data);
      setTheme(data ? "light" : "dark");
    });

    // Clean up the socket connection when the component unmounts
  }, []);

  return <div>{children}</div>;
};

export default ThemeListener;
