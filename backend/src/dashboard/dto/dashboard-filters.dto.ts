import { IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum DashboardPeriod {
  LAST_7_DAYS = 'last_7_days',
  LAST_30_DAYS = 'last_30_days',
  LAST_3_MONTHS = 'last_3_months',
  CUSTOM = 'custom',
}

export class DashboardFiltersDto {
  @ApiPropertyOptional({ 
    enum: DashboardPeriod, 
    default: DashboardPeriod.LAST_7_DAYS,
    description: 'Time period for dashboard data' 
  })
  @IsOptional()
  @IsEnum(DashboardPeriod)
  period?: DashboardPeriod = DashboardPeriod.LAST_7_DAYS;

  @ApiPropertyOptional({ 
    description: 'Start date for custom period (ISO string)' 
  })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ 
    description: 'End date for custom period (ISO string)' 
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiPropertyOptional({ 
    description: 'Filter by specific department ID' 
  })
  @IsOptional()
  departmentId?: number;

  @ApiPropertyOptional({ 
    description: 'Include only urgent resources (idle >= 2 months)' 
  })
  @IsOptional()
  urgentOnly?: boolean;
}
