import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { IdleResourcesService } from './idle-resources.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Idle Resources')
@Controller('idle-resources')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class IdleResourcesController {
  constructor(private readonly idleResourcesService: IdleResourcesService) {}

  @Get()
  findAll() {
    return this.idleResourcesService.findAll();
  }
}
