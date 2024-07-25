"use client";

import { CornerDownLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";
import axios from "axios";

import { Loader2, Terminal } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TableQuestionBank } from "@/components/prebuild/questionbank";

const Icons = {
  spinner: Loader2,
};

export default function Dashboard() {
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [alert, setAlert] = useState("");

  const submitMessage = async (e: any) => {
    e.preventDefault();

    setMessage("");

    setLoading(true);
    const axiosResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/chaining/question-generator`,
      {
        query: message,
      }
    );
    setLoading(false);

    if (axiosResponse.data.error) {
      setAlert("Error submitting data");
    } else {
      setAlert("Data successfully submitted");
    }

    setTimeout(() => {
      setAlert("");
    }, 3000);
  };
  return (
    <div className="grid h-screen w-full">
      <div className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <h1 className="text-xl font-semibold">Question generator</h1>
        </header>
        <main className="grid flex-1 gap-4 overflow-auto p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-3 overflow-y-auto">
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

            <div className="mt-6 justify-center flex-1 border flex">
              {loading && <Icons.spinner className="h-6 w-6 animate-spin" />}
              {alert ? (
                <Alert>
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{alert}</AlertDescription>
                </Alert>
              ) : (
                <TableQuestionBank />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
