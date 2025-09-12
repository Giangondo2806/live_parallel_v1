import { PartialType } from '@nestjs/swagger';
import { CreateIdleResourceDto } from './create-idle-resource.dto';

export class UpdateIdleResourceDto extends PartialType(CreateIdleResourceDto) {}
