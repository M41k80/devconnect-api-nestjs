import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from '../projects/entities/project.entity';
import { User } from '../users/entities/user.entity';
import { ProjectApplication } from '../projects/entities/project-application.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepo: Repository<Project>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(ProjectApplication)
    private readonly applicationRepo: Repository<ProjectApplication>,
  ) {}

  async getStats() {
    const [projects, users, applications] = await Promise.all([
      this.projectRepo.count(),
      this.userRepo.count(),
      this.applicationRepo.count(),
    ]);

    return {
      projects,
      users,
      applications,
    };
  }
}
