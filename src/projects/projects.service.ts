import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Project } from './entities/project.entity';
import { ProjectMember } from './entities/project-member.entity';
import { User } from '../users/entities/user.entity';

import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { ApplyProjectDto } from './dto/apply-project.dto';
import { ProjectApplication } from './entities/project-application.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,

    @InjectRepository(ProjectMember)
    private projectMemberRepo: Repository<ProjectMember>,

    @InjectRepository(User)
    private userRepo: Repository<User>,

    @InjectRepository(ProjectApplication)
    private projectApplicationRepo: Repository<ProjectApplication>,
  ) {}

  async createProject(userId: string, createProjectDto: CreateProjectDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const project = this.projectRepo.create({
      ...createProjectDto,
      owner: user,
    });

    await this.projectRepo.save(project);

    const member = this.projectMemberRepo.create({
      user,
      project,
    });

    await this.projectMemberRepo.save(member);

    return project;
  }

  async getProjects(paginationQuery: GetProjectsDto) {
    const { page = 1, limit = 10, tech, status, search } = paginationQuery;
    const offset = (page - 1) * limit;

    const qb = this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .orderBy('project.createdAt', 'DESC');

    if (status) {
      qb.andWhere('project.status = :status', { status });
    }

    if (tech) {
      const techArray = Array.isArray(tech) ? tech : [tech];

      qb.andWhere(
        techArray
          .map(
            (_, i) =>
              `EXISTS (SELECT 1 FROM unnest(project.techStack) t WHERE LOWER(t) LIKE LOWER(:tech${i}))`,
          )
          .join(' OR '),
        techArray.reduce(
          (acc, t, i) => ({ ...acc, [`tech${i}`]: `%${t}%` }),
          {},
        ),
      );
    }

    if (search) {
      qb.andWhere(
        '(project.title ILIKE :search OR project.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    qb.skip(offset).take(limit);

    const [projects, total] = await qb.getManyAndCount();

    return {
      data: projects,
      meta: {
        total,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getProjectById(id: string) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['owner', 'members', 'members.user'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    return project;
  }

  async applyToProject(
    userId: string,
    projectId: string,
    appyProjectDto: ApplyProjectDto,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const existingApplication = await this.projectApplicationRepo.findOne({
      where: {
        user: { id: userId },
        project: { id: projectId },
      },
    });

    if (existingApplication) {
      throw new BadRequestException('You already applied to this project');
    }

    const application = this.projectApplicationRepo.create({
      user,
      project,
      message: appyProjectDto.message,
    });

    return await this.projectApplicationRepo.save(application);
  }
}
