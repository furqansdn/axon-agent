import { Test, TestingModule } from '@nestjs/testing';
import { ChainingController } from './chaining.controller';
import { ChainingService } from './chaining.service';

describe('ChainingController', () => {
  let controller: ChainingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChainingController],
      providers: [ChainingService],
    }).compile();

    controller = module.get<ChainingController>(ChainingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
