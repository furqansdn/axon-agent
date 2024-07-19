import { AgentExecutor, createOpenAIFunctionsAgent } from 'langchain/agents';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';
import { Runnable } from '@langchain/core/runnables';

export async function createAgent(
  llm: ChatOpenAI,
  tools: any[],
  systemPrompt: string,
): Promise<Runnable> {
  const prompt = await ChatPromptTemplate.fromMessages([
    ['system', systemPrompt],
    new MessagesPlaceholder('messages'),
    new MessagesPlaceholder('agent_scratchpad'),
  ]);

  const agent = await createOpenAIFunctionsAgent({ llm, tools, prompt });

  return new AgentExecutor({ agent, tools });
}
