import { Module } from '@nestjs/common';
import { AdminLogsService } from './admin_logs.service';
import { AdminLogsController } from './admin_logs.controller';

@Module({
  controllers: [AdminLogsController],
  providers: [AdminLogsService],
})
export class AdminLogsModule {}
