import { Test, TestingModule } from '@nestjs/testing';
import { AgentSupervisorService } from './agent-supervisor.service';

describe('AgentSupervisorService', () => {
  let service: AgentSupervisorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentSupervisorService],
    }).compile();

    service = module.get<AgentSupervisorService>(AgentSupervisorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
