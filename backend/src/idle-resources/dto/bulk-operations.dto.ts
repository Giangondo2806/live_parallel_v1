import { IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class BulkDeleteDto {
  @ApiProperty({ 
    description: 'Array of resource IDs to delete',
    type: [Number],
    example: [1, 2, 3]
  })
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  ids: number[];
}

export class ImportResultDto {
  @ApiProperty({ description: 'Number of successfully imported records', example: 45 })
  successCount: number;

  @ApiProperty({ description: 'Number of failed records', example: 2 })
  errorCount: number;

  @ApiProperty({ 
    description: 'List of import errors',
    type: [String],
    example: ['Row 3: Employee code already exists', 'Row 7: Invalid department']
  })
  errors: string[];

  @ApiProperty({ description: 'Total records processed', example: 47 })
  totalProcessed: number;
}

export class ExportFilterDto {
  @ApiProperty({ description: 'Department IDs to export', type: [Number], required: false })
  @IsArray()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  departmentIds?: number[];

  @ApiProperty({ description: 'Status filter for export', required: false })
  status?: string;

  @ApiProperty({ description: 'Export only urgent resources', default: false })
  urgentOnly?: boolean;
}
