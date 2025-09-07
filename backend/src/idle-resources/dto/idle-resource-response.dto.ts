import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceStatus } from '../../common/types';

export class IdleResourceResponseDto {
  @ApiProperty({ description: 'Resource ID', example: 1 })
  id: number;

  @ApiProperty({ description: 'Employee code', example: 'EMP001' })
  employeeCode: string;

  @ApiProperty({ description: 'Full name', example: 'Nguyen Van A' })
  fullName: string;

  @ApiProperty({ description: 'Department ID', example: 1 })
  departmentId: number;

  @ApiProperty({ description: 'Department information' })
  department: {
    id: number;
    name: string;
    code: string;
  };

  @ApiProperty({ description: 'Position', example: 'Java Developer' })
  position: string;

  @ApiPropertyOptional({ description: 'Email', example: 'nguyenvana@company.com' })
  email?: string;

  @ApiPropertyOptional({ description: 'Skill set', example: 'Java, Spring Boot, MySQL' })
  skillSet?: string;

  @ApiProperty({ description: 'Idle from date', example: '2024-01-15' })
  idleFrom: Date;

  @ApiPropertyOptional({ description: 'Idle to date', example: '2024-06-15' })
  idleTo?: Date;

  @ApiProperty({ description: 'Status', enum: ResourceStatus, example: ResourceStatus.IDLE })
  status: ResourceStatus;

  @ApiPropertyOptional({ description: 'Process notes' })
  processNote?: string;

  @ApiPropertyOptional({ description: 'Hourly rate', example: 5000 })
  rate?: number;

  @ApiProperty({ description: 'Is urgent (idle >= 2 months)', example: true })
  isUrgent: boolean;

  @ApiProperty({ description: 'CV files count', example: 1 })
  cvFilesCount: number;

  @ApiProperty({ description: 'Created by user ID', example: 1 })
  createdBy: number;

  @ApiProperty({ description: 'Updated by user ID', example: 1 })
  updatedBy: number;

  @ApiProperty({ description: 'Created at', example: '2024-01-15T10:30:00Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at', example: '2024-01-15T10:30:00Z' })
  updatedAt: Date;
}

export class PaginatedIdleResourceResponseDto {
  @ApiProperty({ type: [IdleResourceResponseDto], description: 'List of resources' })
  data: IdleResourceResponseDto[];

  @ApiProperty({ description: 'Total count', example: 150 })
  total: number;

  @ApiProperty({ description: 'Current page', example: 1 })
  page: number;

  @ApiProperty({ description: 'Page size', example: 20 })
  pageSize: number;

  @ApiProperty({ description: 'Total pages', example: 8 })
  totalPages: number;

  @ApiProperty({ description: 'Has next page', example: true })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page', example: false })
  hasPrev: boolean;
}
