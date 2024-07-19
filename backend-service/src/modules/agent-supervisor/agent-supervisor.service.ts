import { Injectable } from '@nestjs/common';
import { createAgentSupervisor } from 'src/lib/graph/supervisor-agent';

import { HumanMessage } from '@langchain/core/messages';

@Injectable()
export class AgentSupervisorService {
  async agentSupervisor(query: string) {
    const chainAgentSupervisor = await createAgentSupervisor();

    return await chainAgentSupervisor.invoke({
      messages: [new HumanMessage(query)],
    });
  }
}
