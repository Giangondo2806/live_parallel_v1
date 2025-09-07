import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HistoryLogsService } from './history-logs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('History Logs')
@Controller('history-logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class HistoryLogsController {
  constructor(private readonly historyLogsService: HistoryLogsService) {}

  @Get()
  findAll() {
    return this.historyLogsService.findAll();
  }
}
