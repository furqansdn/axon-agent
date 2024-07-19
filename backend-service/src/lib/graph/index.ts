import { START, StateGraph } from '@langchain/langgraph';
import { agentStateChannels, AgentStateChannels } from './supervisor-agent';

const workflow = new StateGraph<AgentStateChannels, unknown, string>({
  channels: agentStateChannels,
});

export const graph = workflow.compile();
