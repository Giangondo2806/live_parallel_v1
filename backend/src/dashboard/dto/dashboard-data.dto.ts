import { ApiProperty } from '@nestjs/swagger';

export class DashboardStatisticsDto {
  @ApiProperty({ description: 'Total number of idle resources' })
  totalIdleResources: number;

  @ApiProperty({ description: 'Number of urgent resources (idle >= 2 months)' })
  urgentResources: number;

  @ApiProperty({ description: 'Number of available resources' })
  availableResources: number;

  @ApiProperty({ description: 'Total number of all resources' })
  totalResources: number;

  @ApiProperty({ description: 'Percentage of idle resources' })
  idlePercentage: number;

  @ApiProperty({ description: 'Number of departments with idle resources' })
  departmentsWithIdle: number;
}

export class DepartmentStatDto {
  @ApiProperty({ description: 'Department ID' })
  departmentId: number;

  @ApiProperty({ description: 'Department name' })
  departmentName: string;

  @ApiProperty({ description: 'Number of idle resources in department' })
  idleCount: number;

  @ApiProperty({ description: 'Total resources in department' })
  totalCount: number;

  @ApiProperty({ description: 'Percentage of idle resources in department' })
  idlePercentage: number;

  @ApiProperty({ description: 'Number of urgent resources in department' })
  urgentCount: number;
}

export class RecentActivityDto {
  @ApiProperty({ description: 'Activity ID' })
  id: number;

  @ApiProperty({ description: 'Resource name' })
  resourceName: string;

  @ApiProperty({ description: 'Resource ID' })
  resourceId: number;

  @ApiProperty({ description: 'Action performed' })
  action: string;

  @ApiProperty({ description: 'User who performed the action' })
  performedBy: string;

  @ApiProperty({ description: 'Department name' })
  department: string;

  @ApiProperty({ description: 'Date and time of action' })
  timestamp: Date;

  @ApiProperty({ description: 'Additional notes or changes' })
  description?: string;
}

export class DashboardDataDto {
  @ApiProperty({ description: 'Overall statistics' })
  statistics: DashboardStatisticsDto;

  @ApiProperty({ 
    type: [DepartmentStatDto], 
    description: 'Statistics by department' 
  })
  departmentStats: DepartmentStatDto[];

  @ApiProperty({ 
    type: [RecentActivityDto], 
    description: 'Recent activities and updates' 
  })
  recentActivities: RecentActivityDto[];

  @ApiProperty({ description: 'Last updated timestamp' })
  lastUpdated: Date;
}
