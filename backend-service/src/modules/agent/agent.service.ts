import { Inject, Injectable, OnModuleInit } from '@nestjs/common';

import { ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';

import { createToolCallingAgent, AgentExecutor } from 'langchain/agents';
import { renderTextDescription } from 'langchain/tools/render';
import { DatabaseTools } from './toolkits/tools/database.tool';
import { LightTools } from './toolkits/tools/light.tool';

@Injectable()
export class AgentService implements OnModuleInit {
  private client: ChatOpenAI;

  toolkits = [];
  constructor(
    @Inject() private sqlTool: DatabaseTools,
    @Inject() private lightTool: LightTools,
  ) {
    this.client = new ChatOpenAI();
  }

  onModuleInit() {
    this.toolkits.push(this.sqlTool);
    this.toolkits.push(this.lightTool);
  }

  async virtualAssistant(query: string) {
    const systemPrompt = `
      You are an assistant that has access to the following set of tools. Here are the names and descriptions for each tool:

      {rendered_tools}

      Answer the user the best as you can. You can use the tools to help you answer the user.
    `;

    const prompt = ChatPromptTemplate.fromMessages([
      ['system', systemPrompt],
      ['placeholder', '{chat_history}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    const agent = createToolCallingAgent({
      llm: this.client, // ChatOpenAI Model
      tools: this.toolkits, // List tools [DatabaseTool, LightTools]
      prompt, // Prompt Template
    });

    const agentExecutor = new AgentExecutor({
      agent, // Agent Chain
      tools: this.toolkits, // List tools [DatabaseTool, LightTools]
      returnIntermediateSteps: true, // Return list tools usage to solve user question
      metadata: { name: 'virtual-assistant' }, // Metadata
      verbose: false, // Log to terminal
    });

    const result = await agentExecutor.invoke({
      rendered_tools: renderTextDescription(this.toolkits),
      input: query,
    });

    return result;
  }
}
