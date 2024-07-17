import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { ChatOpenAI } from '@langchain/openai';
import {
  JsonOutputParser,
  StringOutputParser,
} from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

import { RunnableSequence } from '@langchain/core/runnables';

@Injectable()
export class ChainingService {
  private client: ChatOpenAI;
  constructor() {
    this.client = new ChatOpenAI();
  }

  async questionGenerator(question: string) {
    type Question = {
      question: string;
      major: string;
    };

    type QustionBank = {
      questionBank: Question[];
    };

    const formatInstruction = `
    Your task is to generate a question base on user preferences.
    Respond only in valid JSON. The JSON object you return should match the following schema:
    {{ questionBank: [{{ question: "string", major: "string" }}] }}
    Where questionBank is an array of objects, each with a question and major field.
    `;
    const prompt = await ChatPromptTemplate.fromMessages([
      [
        'system',
        'Answer the user query. Wrap the output in `json` tags\n {format_instructions}',
      ],

      ['human', 'User preferences: {query}'],
    ]).partial({ format_instructions: formatInstruction });

    const parser = new JsonOutputParser<QustionBank>();

    const writeToDocument = async (output: QustionBank) => {
      const data = { ...output };

      const filePath = path.join(
        __dirname + '/../../../',
        'question_bank.json',
      );

      if (fs.existsSync(filePath)) {
        const existingData = await fs.promises.readFile(filePath, 'utf-8');
        data.questionBank = [
          ...JSON.parse(existingData).questionBank,
          ...data.questionBank,
        ];
      }

      fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');

      return output;
    };
    const chain = prompt
      .pipe(this.client) // OpenAI Chat Model
      .pipe(parser) // JSON Output Parser function
      .pipe(writeToDocument); // Write to document function

    return chain.invoke({ query: question });
  }

  public async customRouteExecution(prompt: string) {
    const promptTemplateClasification = ChatPromptTemplate.fromTemplate(
      `Given the user question below, classify it as either being \`LangChain\`, \`Anthropic\`, or \`Other\`.
      
      Do not response with more than one word

      <question>
      {question}
      </question>
      
      Classification:`,
    );

    const classificationChain = RunnableSequence.from([
      promptTemplateClasification,
      this.client,
      new StringOutputParser(),
    ]);

    const langchain = ChatPromptTemplate.fromTemplate(
      `
    You are an expert in langchain.
    Always answer questions starting with "As Harrison Chase told me".
    Respond to the following question:

    Question: {question}
    Answer:
    `,
    ).pipe(this.client);

    const anthropicChain = ChatPromptTemplate.fromTemplate(
      `You are an expert in anthropic. \
      Always answer questions starting with "As Dario Amodei told me". \
      Respond to the following question:

      Question: {question}
      Answer:`,
    ).pipe(this.client);

    const generalChain = ChatPromptTemplate.fromTemplate(
      `Respond to the following question:

      Question: {question}
      Answer:`,
    ).pipe(this.client);

    const route = (data: { question: string; topic: string }) => {
      const { topic } = data;
      if (topic.toLowerCase().includes('anthropic')) {
        return anthropicChain;
      } else if (topic.toLowerCase().includes('langchain')) {
        return langchain;
      } else {
        return generalChain;
      }
    };

    const finalChain = RunnableSequence.from([
      {
        topic: classificationChain,
        question: (input: { question: string }) => {
          return input.question;
        },
      },
      route,
    ]);

    // console.log(finalChain);

    const result = await finalChain.invoke({
      question: prompt,
    });

    return result;
  }
}
