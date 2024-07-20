import { START, StateGraph } from '@langchain/langgraph';
import {
  agentStateChannels,
  AgentStateChannels,
  createAgentSupervisor,
  members,
} from './supervisor-agent';
import { researcherNode } from './researcher-agent';
import { chartGenNode } from './chart-agent';

export const workflow = async () => {
  const supervisorNode = await createAgentSupervisor();
  const graphWorkflow = new StateGraph<AgentStateChannels, unknown, string>({
    channels: agentStateChannels,
  })
    .addNode('researcher', researcherNode)
    .addNode('chart_generator', chartGenNode)
    .addNode('supervisor', supervisorNode);

  members.forEach((member) => {
    graphWorkflow.addEdge(member, 'supervisor');
  });

  graphWorkflow.addConditionalEdges('supervisor', (state) => state.next);

  graphWorkflow.addEdge(START, 'supervisor');

  return graphWorkflow;
};
