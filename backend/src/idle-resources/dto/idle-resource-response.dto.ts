import { ApiProperty } from '@nestjs/swagger';
import { IdleResource } from '../entities/idle-resource.entity';

export class IdleResourceResponseDto {
  @ApiProperty({ description: 'Resource ID' })
  id: number;

  @ApiProperty({ description: 'Employee code' })
  employeeCode: string;

  @ApiProperty({ description: 'Full name' })
  fullName: string;

  @ApiProperty({ description: 'Department information' })
  department?: {
    id: number;
    name: string;
    code: string;
  };

  @ApiProperty({ description: 'Job position' })
  position: string;

  @ApiProperty({ description: 'Email address' })
  email?: string;

  @ApiProperty({ description: 'Skill set' })
  skillSet?: string;

  @ApiProperty({ description: 'Idle start date' })
  idleFrom: Date;

  @ApiProperty({ description: 'Idle end date' })
  idleTo?: Date;

  @ApiProperty({ description: 'Resource status' })
  status: string;

  @ApiProperty({ description: 'Rate per hour' })
  rate?: number;

  @ApiProperty({ description: 'Process notes' })
  processNote?: string;

  @ApiProperty({ description: 'Is urgent (idle >= 2 months)' })
  isUrgent: boolean;

  @ApiProperty({ description: 'CV files count' })
  cvFilesCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Created by user' })
  createdBy?: {
    id: number;
    username: string;
    fullName: string;
  };

  @ApiProperty({ description: 'Updated by user' })
  updatedBy?: {
    id: number;
    username: string;
    fullName: string;
  };

  constructor(resource: IdleResource) {
    this.id = resource.id;
    this.employeeCode = resource.employeeCode;
    this.fullName = resource.fullName;
    this.department = resource.department ? {
      id: resource.department.id,
      name: resource.department.name,
      code: resource.department.code
    } : undefined;
    this.position = resource.position;
    this.email = resource.email;
    this.skillSet = resource.skillSet;
    this.idleFrom = resource.idleFrom;
    this.idleTo = resource.idleTo;
    this.status = resource.status;
    this.rate = resource.rate;
    this.processNote = resource.processNote;
    
    // Calculate if urgent (idle >= 2 months)
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    this.isUrgent = resource.idleFrom <= twoMonthsAgo;
    
    this.cvFilesCount = resource.cvFiles?.length || 0;
    this.createdAt = resource.createdAt;
    this.updatedAt = resource.updatedAt;
    
    this.createdBy = resource.createdByUser ? {
      id: resource.createdByUser.id,
      username: resource.createdByUser.username,
      fullName: resource.createdByUser.fullName
    } : undefined;
    
    this.updatedBy = resource.updatedByUser ? {
      id: resource.updatedByUser.id,
      username: resource.updatedByUser.username,
      fullName: resource.updatedByUser.fullName
    } : undefined;
  }
}

export class PaginatedIdleResourceResponseDto {
  @ApiProperty({ description: 'List of idle resources' })
  data: IdleResourceResponseDto[];

  @ApiProperty({ description: 'Total count of resources' })
  total: number;

  @ApiProperty({ description: 'Current page number' })
  page: number;

  @ApiProperty({ description: 'Items per page' })
  limit: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages: number;

  @ApiProperty({ description: 'Has next page' })
  hasNext: boolean;

  @ApiProperty({ description: 'Has previous page' })
  hasPrev: boolean;
}
