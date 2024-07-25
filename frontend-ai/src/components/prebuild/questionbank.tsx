"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "../ui/scroll-area";

export function TableQuestionBank() {
  const [loading, setLoading] = useState(false);
  const [questionBank, setQuestionBank] = useState<
    { question: string; major: string }[]
  >([]);

  const fetchQuestionBank = async () => {
    setLoading(true);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/chaining/get-question-bank`
    );
    const data = await response.json();
    setQuestionBank(data.questionBank);
    setLoading(false);
  };

  useEffect(() => {
    fetchQuestionBank();
  }, []);

  return loading ? (
    <div className="text-lg">Loading...</div>
  ) : (
    <Table className="max-h-[600px]">
      <TableCaption>A list of Question Bank</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">No</TableHead>
          <TableHead>Question</TableHead>
          <TableHead>Question Type</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {questionBank.map((question, index) => (
          <TableRow key={`${question.major}_${index}`}>
            <TableCell className="font-medium">{index + 1}</TableCell>
            <TableCell>{question.question}</TableCell>
            <TableCell>{question.major}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
