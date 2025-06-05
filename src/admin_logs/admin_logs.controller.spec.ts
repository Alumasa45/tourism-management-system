import { Test, TestingModule } from '@nestjs/testing';
import { AdminLogsController } from './admin_logs.controller';
import { AdminLogsService } from './admin_logs.service';

describe('AdminLogsController', () => {
  let controller: AdminLogsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminLogsController],
      providers: [AdminLogsService],
    }).compile();

    controller = module.get<AdminLogsController>(AdminLogsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
