import { IsNotEmpty, IsString, IsNumber, IsOptional, IsEmail, IsDate, IsEnum, IsDecimal, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { ResourceStatus } from '../../common/types';

export class CreateIdleResourceDto {
  @ApiProperty({ description: 'Employee code', maxLength: 20, example: 'EMP001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  employeeCode: string;

  @ApiProperty({ description: 'Full name of employee', maxLength: 100, example: 'Nguyen Van A' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  fullName: string;

  @ApiProperty({ description: 'Department ID', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  departmentId: number;

  @ApiProperty({ description: 'Position/Role', maxLength: 100, example: 'Java Developer' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  position: string;

  @ApiPropertyOptional({ description: 'Email address', maxLength: 100, example: 'nguyenvana@company.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Skill set (comma separated)', example: 'Java, Spring Boot, MySQL' })
  @IsOptional()
  @IsString()
  skillSet?: string;

  @ApiProperty({ description: 'Date when employee became idle', example: '2024-01-15' })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  idleFrom: Date;

  @ApiPropertyOptional({ description: 'Date when employee is no longer idle', example: '2024-06-15' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  idleTo?: Date;

  @ApiProperty({ 
    description: 'Current status of the resource',
    enum: ResourceStatus,
    default: ResourceStatus.IDLE,
    example: ResourceStatus.IDLE
  })
  @IsNotEmpty()
  @IsEnum(ResourceStatus)
  status: ResourceStatus;

  @ApiPropertyOptional({ description: 'Process notes or comments' })
  @IsOptional()
  @IsString()
  processNote?: string;

  @ApiPropertyOptional({ description: 'Hourly rate in JPY', example: 5000 })
  @IsOptional()
  @IsDecimal({ decimal_digits: '0,2' })
  @Transform(({ value }) => parseFloat(value))
  rate?: number;
}
