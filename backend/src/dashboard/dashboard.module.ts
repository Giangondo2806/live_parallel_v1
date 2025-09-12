import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { IdleResource } from '../idle-resources/entities/idle-resource.entity';
import { Department } from '../departments/entities/department.entity';
import { User } from '../users/entities/user.entity';
import { HistoryLog } from '../history-logs/entities/history-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdleResource, Department, User, HistoryLog])],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService], // Export for potential use in other modules
})
export class DashboardModule {}
