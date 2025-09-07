import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdleResourcesService } from './idle-resources.service';
import { IdleResourcesController } from './idle-resources.controller';
import { IdleResource } from './entities/idle-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([IdleResource])],
  controllers: [IdleResourcesController],
  providers: [IdleResourcesService],
  exports: [IdleResourcesService],
})
export class IdleResourcesModule {}
