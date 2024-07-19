import { RunnableConfig } from '@langchain/core/runnables';
import { HumanMessage } from '@langchain/core/messages';
import { createAgent } from './agent';
import { ChatOpenAI } from '@langchain/openai';
import chartTool from './tools/chat.tool';
import { AgentStateChannels } from './supervisor-agent';

const chartGenAgent = async () => {
  return await createAgent(
    new ChatOpenAI(),
    [chartTool],
    "You excel at generating bar charts. Use the researcher's information to generate the charts.",
  );
};

export const chartGenNode = async (
  state: AgentStateChannels,
  config: RunnableConfig,
) => {
  const agent = await chartGenAgent();
  const result = await agent.invoke(state, config);

  return {
    messages: [
      new HumanMessage({ content: result.output, name: 'ChartGenerator' }),
    ],
  };
};
