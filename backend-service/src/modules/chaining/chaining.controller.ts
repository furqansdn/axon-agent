import { Body, Controller, Post, Get } from '@nestjs/common';
import { ChainingService } from './chaining.service';
import { UserQuery } from 'src/common/dto/user-query.dto';
import { ApiTags } from '@nestjs/swagger';

@Controller('chaining')
@ApiTags('Chaining')
export class ChainingController {
  constructor(private readonly chainingService: ChainingService) {}

  @Post('question-generator')
  async questionGenerator(@Body() body: UserQuery) {
    return this.chainingService.questionGenerator(body.query);
  }

  @Post('custom-route-execution')
  async customRouteExecution(@Body() body: UserQuery) {
    return this.chainingService.customRouteExecution(body.query);
  }

  @Get('get-question-bank')
  async questionBank() {
    return this.chainingService.getQuestionBank();
  }
}
