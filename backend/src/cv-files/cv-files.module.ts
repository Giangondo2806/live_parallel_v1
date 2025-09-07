import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CvFilesService } from './cv-files.service';
import { CvFilesController } from './cv-files.controller';
import { CVFile } from './entities/cv-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CVFile])],
  controllers: [CvFilesController],
  providers: [CvFilesService],
  exports: [CvFilesService],
})
export class CvFilesModule {}
