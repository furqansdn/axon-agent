import { Body, Controller, Post } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { ApiTags } from '@nestjs/swagger';
import { UserQuery } from 'src/common/dto/user-query.dto';

@Controller('langgraph')
@ApiTags('Langgraph')
export class LanggraphController {
  constructor(private readonly langgraphService: LanggraphService) {}

  @Post()
  async nodeExample(@Body() body: UserQuery) {
    return this.langgraphService.nodeExample(body.query);
  }

  @Post('state')
  async stateManagement(@Body() body: UserQuery) {
    return this.langgraphService.stateManagement(body.queryNumber);
  }

  @Post('root-reducer')
  async rootReducer(@Body() body: UserQuery) {
    return this.langgraphService.rootReducer(body.query);
  }

  @Post('configurable')
  async configurable() {
    return this.langgraphService.configuration();
  }

  @Post('subgraph')
  async langgraph() {
    return this.langgraphService.subGraph();
  }

  @Post('subgraphwithid')
  async subgraphwithid() {
    return this.langgraphService.subGraphWithID();
  }

  @Post('persistentgraph')
  async persistentGraph() {
    return this.langgraphService.persistentGraph();
  }

  @Post('agentsupervisor')
  async agentSupervisor(@Body() body: UserQuery) {
    return this.langgraphService.agentSupervisor(body.query);
  }
}
