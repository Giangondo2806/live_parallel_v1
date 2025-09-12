import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsDateString, IsNumber, Min, Max } from 'class-validator';

export class DashboardFiltersDto {
  @ApiPropertyOptional({ description: 'Filter by department ID' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Filter from date (ISO format)', example: '2024-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Filter to date (ISO format)', example: '2024-12-31T23:59:59.999Z' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Limit number of results', minimum: 1, maximum: 100, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class DashboardStatsDto {
  @ApiProperty({ description: 'Total number of resources' })
  @IsNumber()
  totalResources: number;

  @ApiProperty({ description: 'Number of idle resources' })
  @IsNumber()
  totalIdle: number;

  @ApiProperty({ description: 'Number of urgent resources (idle > 2 months)' })
  @IsNumber()
  urgentCount: number;

  @ApiProperty({ description: 'Number of available resources' })
  @IsNumber()
  availableCount: number;

  @ApiProperty({ description: 'Percentage of idle resources' })
  @IsNumber()
  idlePercentage: number;
}

export class DepartmentStatsDto {
  @ApiProperty({ description: 'Department ID' })
  @IsString()
  departmentId: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  departmentName: string;

  @ApiProperty({ description: 'Total resources in department' })
  @IsNumber()
  totalResources: number;

  @ApiProperty({ description: 'Idle resources in department' })
  @IsNumber()
  idleResources: number;

  @ApiProperty({ description: 'Urgent resources in department' })
  @IsNumber()
  urgentResources: number;

  @ApiProperty({ description: 'Percentage of idle resources in department' })
  @IsNumber()
  idlePercentage: number;
}

export class RecentActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Resource name involved in activity' })
  @IsString()
  resourceName: string;

  @ApiProperty({ description: 'Activity type' })
  @IsString()
  activityType: string;

  @ApiProperty({ description: 'Activity description' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'User who performed the activity' })
  @IsString()
  performedBy: string;

  @ApiProperty({ description: 'Activity timestamp' })
  @IsDateString()
  timestamp: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  departmentName: string;
}

export class DashboardDataDto {
  @ApiProperty({ description: 'Overall dashboard statistics' })
  stats: DashboardStatsDto;

  @ApiProperty({ description: 'Department-wise statistics', type: [DepartmentStatsDto] })
  departmentStats: DepartmentStatsDto[];

  @ApiProperty({ description: 'Recent activities', type: [RecentActivityDto] })
  recentActivities: RecentActivityDto[];

  @ApiProperty({ description: 'Quick action suggestions' })
  quickActions: {
    hasUrgentResources: boolean;
    suggestedActions: string[];
    alertMessages: string[];
  };

  @ApiProperty({ description: 'Chart data for dashboard visualizations' })
  chartData: {
    idleTrendData: Array<{ date: string; count: number }>;
    departmentDistribution: Array<{ department: string; count: number; percentage: number }>;
    statusDistribution: Array<{ status: string; count: number; percentage: number }>;
  };
}
