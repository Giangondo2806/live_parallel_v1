import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { IdleResource } from '../idle-resources/entities/idle-resource.entity';
import { Department } from '../departments/entities/department.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdleResource, Department, User])],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
