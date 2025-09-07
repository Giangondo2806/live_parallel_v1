import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdleResource } from './entities/idle-resource.entity';

@Injectable()
export class IdleResourcesService {
  constructor(
    @InjectRepository(IdleResource)
    private idleResourceRepository: Repository<IdleResource>,
  ) {}

  async findAll(): Promise<IdleResource[]> {
    return this.idleResourceRepository.find({
      relations: ['department', 'createdByUser', 'updatedByUser'],
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<IdleResource | null> {
    return this.idleResourceRepository.findOne({
      where: { id },
      relations: ['department', 'createdByUser', 'updatedByUser', 'cvFiles'],
    });
  }
}
