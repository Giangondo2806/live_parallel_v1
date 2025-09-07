import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CvFilesService } from './cv-files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('CV Files')
@Controller('cv-files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CvFilesController {
  constructor(private readonly cvFilesService: CvFilesService) {}

  @Get('resource/:resourceId')
  findByResourceId(@Param('resourceId') resourceId: string) {
    return this.cvFilesService.findByResourceId(+resourceId);
  }
}
