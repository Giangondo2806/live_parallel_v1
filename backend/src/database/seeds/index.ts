import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Department } from '../../departments/entities/department.entity';
import { User } from '../../users/entities/user.entity';
import { IdleResource } from '../../idle-resources/entities/idle-resource.entity';
import { CVFile } from '../../cv-files/entities/cv-file.entity';
import { HistoryLog } from '../../history-logs/entities/history-log.entity';

import { departments } from './departments.seed';
import { users } from './users.seed';
import { idleResources } from './resources.seed';
import { cvFiles } from './files.seed';
import { historyLogs } from './history.seed';

export class DatabaseSeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    console.log('🌱 Starting database seeding...');

    try {
      // 1. Seed Departments
      console.log('📁 Seeding departments...');
      const departmentRepository = this.dataSource.getRepository(Department);
      await departmentRepository.save(departments);

      // 2. Seed Users (with hashed passwords)
      console.log('👥 Seeding users...');
      const userRepository = this.dataSource.getRepository(User);
      const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => ({
          ...user,
          password: await bcrypt.hash('password123', 10), // Default password for all users
        }))
      );
      await userRepository.save(usersWithHashedPasswords);

      // 3. Seed Idle Resources
      console.log('💼 Seeding idle resources...');
      const resourceRepository = this.dataSource.getRepository(IdleResource);
      await resourceRepository.save(idleResources);

      // 4. Seed CV Files
      console.log('📄 Seeding CV files...');
      const cvFileRepository = this.dataSource.getRepository(CVFile);
      await cvFileRepository.save(cvFiles);

      // 5. Seed History Logs
      console.log('📝 Seeding history logs...');
      const historyRepository = this.dataSource.getRepository(HistoryLog);
      await historyRepository.save(historyLogs);

      console.log('✅ Database seeding completed successfully!');
      console.log('');
      console.log('🔑 Default Login Credentials:');
      console.log('Admin: admin / password123');
      console.log('RA All: ra_all / password123');
      console.log('RA Dev: ra_dev / password123');
      console.log('Manager IT: manager_it / password123');
      console.log('Manager QA: manager_qa / password123');
      console.log('Viewer: viewer1 / password123');
      console.log('');

    } catch (error) {
      console.error('❌ Error seeding database:', error);
      throw error;
    }
  }

  async clearDatabase() {
    console.log('🧹 Clearing existing data...');
    
    // Disable foreign key checks
    await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 0');
    
    try {
      // Clear all tables
      await this.dataSource.getRepository(HistoryLog).clear();
      await this.dataSource.getRepository(CVFile).clear();
      await this.dataSource.getRepository(IdleResource).clear();
      await this.dataSource.getRepository(User).clear();
      await this.dataSource.getRepository(Department).clear();
    } finally {
      // Re-enable foreign key checks
      await this.dataSource.query('SET FOREIGN_KEY_CHECKS = 1');
    }
  }
}
