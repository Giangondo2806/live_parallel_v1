import { IsOptional, IsString, IsNumber, IsEnum, IsDate, Min, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ResourceStatus } from '../../common/types';

export class SearchCriteriaDto {
  @ApiPropertyOptional({ description: 'Page number', minimum: 1, default: 1, example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Page size', minimum: 1, maximum: 100, default: 20, example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;

  @ApiPropertyOptional({ description: 'Search text (name, employee code, skill)', example: 'Java' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Department ID filter', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  departmentId?: number;

  @ApiPropertyOptional({ 
    description: 'Status filter',
    enum: ResourceStatus,
    example: ResourceStatus.IDLE
  })
  @IsOptional()
  @IsEnum(ResourceStatus)
  status?: ResourceStatus;

  @ApiPropertyOptional({ description: 'Filter by idle from date (start)', example: '2024-01-01' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  idleFromStart?: Date;

  @ApiPropertyOptional({ description: 'Filter by idle from date (end)', example: '2024-12-31' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  idleFromEnd?: Date;

  @ApiPropertyOptional({ description: 'Show only urgent resources (idle >= 2 months)', default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  urgent?: boolean;

  @ApiPropertyOptional({ description: 'Sort field', example: 'fullName', default: 'updatedAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'updatedAt';

  @ApiPropertyOptional({ description: 'Sort order', enum: ['ASC', 'DESC'], default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
