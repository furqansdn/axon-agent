import { Test, TestingModule } from '@nestjs/testing';
import { AgentSupervisorController } from './agent-supervisor.controller';
import { AgentSupervisorService } from './agent-supervisor.service';

describe('AgentSupervisorController', () => {
  let controller: AgentSupervisorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgentSupervisorController],
      providers: [AgentSupervisorService],
    }).compile();

    controller = module.get<AgentSupervisorController>(AgentSupervisorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
