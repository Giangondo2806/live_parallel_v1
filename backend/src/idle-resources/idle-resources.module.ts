import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdleResourcesService } from './idle-resources.service';
import { IdleResourcesController } from './idle-resources.controller';
import { IdleResource } from './entities/idle-resource.entity';
import { Department } from '../departments/entities/department.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdleResource, Department, User])],
  controllers: [IdleResourcesController],
  providers: [IdleResourcesService],
  exports: [IdleResourcesService],
})
export class IdleResourcesModule {}
