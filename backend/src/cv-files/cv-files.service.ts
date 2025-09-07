import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CVFile } from './entities/cv-file.entity';

@Injectable()
export class CvFilesService {
  constructor(
    @InjectRepository(CVFile)
    private cvFileRepository: Repository<CVFile>,
  ) {}

  async findByResourceId(resourceId: number): Promise<CVFile[]> {
    return this.cvFileRepository.find({
      where: { resourceId, isActive: true },
      relations: ['uploadedByUser'],
      order: { uploadedAt: 'DESC' },
    });
  }
}
