import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateIdleResourceDto } from './create-idle-resource.dto';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdateIdleResourceDto extends PartialType(CreateIdleResourceDto) {
  @ApiPropertyOptional({ description: 'User ID who is updating this record' })
  @IsOptional()
  @IsNumber()
  updatedBy?: number;
}
