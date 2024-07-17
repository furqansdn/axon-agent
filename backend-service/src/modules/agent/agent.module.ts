import { Module } from '@nestjs/common';
import { AgentService } from './agent.service';
import { AgentController } from './agent.controller';
import { ToolkitsModule } from './toolkits/toolkits.module';

@Module({
  imports: [ToolkitsModule],
  controllers: [AgentController],
  providers: [AgentService],
})
export class AgentModule {}
