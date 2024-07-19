import { Module } from '@nestjs/common';
import { AgentSupervisorService } from './agent-supervisor.service';
import { AgentSupervisorController } from './agent-supervisor.controller';

@Module({
  controllers: [AgentSupervisorController],
  providers: [AgentSupervisorService],
})
export class AgentSupervisorModule {}
