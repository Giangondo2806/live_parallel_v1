import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsDateString } from 'class-validator';
import { ResourceStatus } from '../../common/types';

export class CreateIdleResourceDto {
  @ApiProperty({ description: 'Employee code', example: 'EMP001' })
  @IsNotEmpty()
  @IsString()
  employeeCode: string;

  @ApiProperty({ description: 'Full name of the employee', example: 'Nguyen Van A' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ description: 'Department ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty({ description: 'Job position', example: 'Senior Developer' })
  @IsNotEmpty()
  @IsString()
  position: string;

  @ApiProperty({ description: 'Email address', example: 'nguyen.van.a@company.com', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Skill set', example: 'Java, Spring Boot, React', required: false })
  @IsOptional()
  @IsString()
  skillSet?: string;

  @ApiProperty({ description: 'Idle start date', example: '2024-01-15' })
  @IsNotEmpty()
  @IsDateString()
  idleFrom: string;

  @ApiProperty({ description: 'Idle end date', example: '2024-06-15', required: false })
  @IsOptional()
  @IsDateString()
  idleTo?: string;

  @ApiProperty({ description: 'Resource status', example: 'IDLE', enum: ResourceStatus })
  @IsNotEmpty()
  status: ResourceStatus;

  @ApiProperty({ description: 'Rate per hour', example: 50, required: false })
  @IsOptional()
  @IsNumber()
  rate?: number;

  @ApiProperty({ description: 'Process notes', required: false })
  @IsOptional()
  @IsString()
  processNote?: string;
}
