import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryLogsService } from './history-logs.service';
import { HistoryLogsController } from './history-logs.controller';
import { HistoryLog } from './entities/history-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryLog])],
  controllers: [HistoryLogsController],
  providers: [HistoryLogsService],
  exports: [HistoryLogsService],
})
export class HistoryLogsModule {}
