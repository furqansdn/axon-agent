import { Module } from '@nestjs/common';
import { ChainingService } from './chaining.service';
import { ChainingController } from './chaining.controller';

@Module({
  controllers: [ChainingController],
  providers: [ChainingService],
})
export class ChainingModule {}
