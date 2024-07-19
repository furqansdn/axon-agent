import { Module } from '@nestjs/common';
import { LanggraphService } from './langgraph.service';
import { LanggraphController } from './langgraph.controller';

@Module({
  controllers: [LanggraphController],
  providers: [LanggraphService],
})
export class LanggraphModule {}
