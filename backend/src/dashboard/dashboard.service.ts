import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IdleResource } from '../idle-resources/entities/idle-resource.entity';
import { Department } from '../departments/entities/department.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(IdleResource)
    private idleResourceRepository: Repository<IdleResource>,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
  ) {}

  async getDashboardData() {
    const totalIdle = await this.idleResourceRepository.count();
    const urgentCount = await this.getUrgentResourceCount();
    const departmentStats = await this.getDepartmentStats();
    const recentUpdates = await this.getRecentUpdates();

    return {
      totalIdle,
      urgentCount,
      departmentStats,
      recentUpdates,
    };
  }

  private async getUrgentResourceCount(): Promise<number> {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    return this.idleResourceRepository.count({
      where: {
        idleFrom: { } as any, // This needs proper date comparison
      },
    });
  }

  private async getDepartmentStats() {
    return this.idleResourceRepository
      .createQueryBuilder('resource')
      .select('department.name', 'departmentName')
      .addSelect('COUNT(resource.id)', 'count')
      .leftJoin('resource.department', 'department')
      .groupBy('department.id')
      .getRawMany();
  }

  private async getRecentUpdates() {
    return this.idleResourceRepository.find({
      relations: ['department', 'updatedByUser'],
      order: { updatedAt: 'DESC' },
      take: 10,
    });
  }
}
