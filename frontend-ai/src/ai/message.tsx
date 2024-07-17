"use client";

import { AIMessageText } from "@/components/prebuild/message";
// import { AIMessageText } from "@/components/prebuilt/message";
import { StreamableValue, useStreamableValue } from "ai/rsc";

export function AIMessage(props: { value: StreamableValue<string> }) {
  const [data] = useStreamableValue(props.value);

  if (!data) {
    return null;
  }
  //   return <div> AI Message {data}</div>;
  return <AIMessageText content={data} />;
}
