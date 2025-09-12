import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, IsArray, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { ResourceStatus } from '../../common/types';

export class SearchCriteriaDto {
  @ApiProperty({ description: 'Search term for name, employee code, or skills', required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ description: 'Department ID filter', required: false })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  departmentId?: number;

  @ApiProperty({ description: 'Resource status filter', enum: ResourceStatus, required: false })
  @IsOptional()
  status?: ResourceStatus;

  @ApiProperty({ description: 'Position filter', required: false })
  @IsOptional()
  @IsString()
  position?: string;

  @ApiProperty({ description: 'Idle from date filter (from)', required: false })
  @IsOptional()
  @IsDateString()
  idleFromStart?: string;

  @ApiProperty({ description: 'Idle from date filter (to)', required: false })
  @IsOptional()
  @IsDateString()
  idleFromEnd?: string;

  @ApiProperty({ description: 'Show only urgent resources (idle >= 2 months)', required: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  urgentOnly?: boolean;

  @ApiProperty({ description: 'Skills filter', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @ApiProperty({ description: 'Page number for pagination', required: false, default: 1 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1)
  @IsNumber()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 10)
  @IsNumber()
  limit?: number = 10;

  @ApiProperty({ description: 'Sort field', required: false, default: 'updatedAt' })
  @IsOptional()
  @IsString()
  sortBy?: string = 'updatedAt';

  @ApiProperty({ description: 'Sort order', required: false, default: 'DESC' })
  @IsOptional()
  @IsString()
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
