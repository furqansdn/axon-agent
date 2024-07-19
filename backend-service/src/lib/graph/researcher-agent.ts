import { RunnableConfig } from '@langchain/core/runnables';

import { HumanMessage } from '@langchain/core/messages';
import { tavilyTool } from './tools/tavily.tool';
import { ChatOpenAI } from '@langchain/openai';
import { createAgent } from './agent';
import { AgentStateChannels } from './supervisor-agent';

const researcherAgent = async () => {
  return await createAgent(
    new ChatOpenAI(),
    [tavilyTool],
    'You are a web researcher. You may use the Tavily search engine to search the web for' +
      ' important information, so the Chart Generator in your team can make useful plots.',
  );
};

export const researcherNode = async (
  state: AgentStateChannels,
  config: RunnableConfig,
) => {
  const agent = await researcherAgent();
  const result = await agent.invoke(state, config);

  return {
    messages: [
      new HumanMessage({ content: result.output, name: 'Researcher' }),
    ],
  };
};
