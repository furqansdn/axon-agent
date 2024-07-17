import { Body, Controller, Post } from '@nestjs/common';
import { AgentService } from './agent.service';
import { ApiTags } from '@nestjs/swagger';
import { UserQuery } from 'src/common/dto/user-query.dto';

@Controller('agent')
@ApiTags('Agent')
export class AgentController {
  constructor(private readonly agentService: AgentService) {}

  @Post('virtual-assistant')
  async virtualAssistant(@Body() body: UserQuery) {
    return this.agentService.virtualAssistant(body.query);
  }
}
