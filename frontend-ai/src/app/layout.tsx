import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import ThemeListener from "@/components/theme-listener";
import { EndpointsContext } from "./agent";
import MainComponent from "@/components/system/main";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Axon AI Assistant",
  description: "AI Assistant for Axon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <ThemeListener>
              <EndpointsContext>
                <MainComponent>{children}</MainComponent>
              </EndpointsContext>
            </ThemeListener>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
