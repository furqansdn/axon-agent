import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { StructuredTool } from '@langchain/core/tools';
import { createSqlQueryChain } from 'langchain/chains/sql_db';
import { SqlDatabase } from 'langchain/sql_db';
import { QuerySqlTool } from 'langchain/tools/sql';
import { PromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';

import { DataSource } from 'typeorm';

import { z } from 'zod';
import {
  RunnableSequence,
  RunnablePassthrough,
} from '@langchain/core/runnables';

@Injectable()
export class DatabaseTools extends StructuredTool {
  name: string = 'DatabaseTools';
  schema = z.object({
    question: z
      .string()
      .describe(
        'The question to ask the database do not pass query sql use natural language instead',
      ),
  });
  description = `A tool that allows you to ask questions to a SQL database that is contains information about list of table. 
  This database contains table User `;
  constructor(private datasource: DataSource) {
    super();
  }

  async _call(arg: z.infer<typeof this.schema>): Promise<string> {
    const llm = new ChatOpenAI();

    const db = await SqlDatabase.fromDataSourceParams({
      appDataSource: this.datasource,
    });

    const executeQuery = new QuerySqlTool(db);
    const writeQuery = await createSqlQueryChain({
      llm,
      db,
      dialect: 'sqlite',
    });

    const answerPrompt =
      PromptTemplate.fromTemplate(`Given the following user question, corresponding SQL query, and SQL result, answer the user question.

    Question: {question}
    SQL Query: {query}
    SQL Result: {result}
    Answer: `);

    const answerChain = answerPrompt.pipe(llm).pipe(new StringOutputParser());

    const chain = RunnableSequence.from([
      RunnablePassthrough.assign({ query: writeQuery }).assign({
        result: (i: { query: string }) => executeQuery.invoke(i.query),
      }),
      answerChain,
    ]);

    const result = await chain.invoke({ question: arg.question });
    return result;
  }
}
