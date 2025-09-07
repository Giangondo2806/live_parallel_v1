import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HistoryLog } from './entities/history-log.entity';

@Injectable()
export class HistoryLogsService {
  constructor(
    @InjectRepository(HistoryLog)
    private historyLogRepository: Repository<HistoryLog>,
  ) {}

  async findAll(): Promise<HistoryLog[]> {
    return this.historyLogRepository.find({
      relations: ['changedByUser', 'resource'],
      order: { changedAt: 'DESC' },
      take: 100, // Limit to recent 100 logs
    });
  }
}
