import { Test, TestingModule } from '@nestjs/testing';
import { ChainingService } from './chaining.service';

describe('ChainingService', () => {
  let service: ChainingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChainingService],
    }).compile();

    service = module.get<ChainingService>(ChainingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
