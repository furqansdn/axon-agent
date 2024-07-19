import { Body, Controller, Post } from '@nestjs/common';
import { AgentSupervisorService } from './agent-supervisor.service';
import { UserQuery } from 'src/common/dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('agent-supervisor')
@ApiTags('Agent Supervisor')
export class AgentSupervisorController {
  constructor(
    private readonly agentSupervisorService: AgentSupervisorService,
  ) {}

  @Post()
  async agentSupervisor(@Body() body: UserQuery) {
    return this.agentSupervisorService.agentSupervisor(body.query);
  }
}
