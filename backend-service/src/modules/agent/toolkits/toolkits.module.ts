import { Module } from '@nestjs/common';
import { DatabaseTools } from './tools/database.tool';
import { LightTools } from './tools/light.tool';

@Module({
  providers: [DatabaseTools, LightTools],
  exports: [DatabaseTools, LightTools],
})
export class ToolkitsModule {}
