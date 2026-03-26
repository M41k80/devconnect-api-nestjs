import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';

import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectApplication } from '../projects/entities/project-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Project, User, ProjectApplication])],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
