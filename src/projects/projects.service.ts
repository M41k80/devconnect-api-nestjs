import {
  BadRequestException,
  ForbiddenException,
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
import { ApplicationStatus } from './enums/application-status.enum';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/responses/project-response.dto';

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

  private validateProjectOwner(project: Project, userId: string) {
    if (project.owner.id !== userId) {
      throw new ForbiddenException(
        'Only the project owner can view applications',
      );
    }
  }

  async createProject(
    userId: string,
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
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

    return {
      id: project.id,
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      owner: {
        id: user.id,
        fullName: user.fullName,
      },
    };
  }

  async getProjects(paginationQuery: GetProjectsDto) {
    const { page = 1, limit = 10, tech, status, search } = paginationQuery;
    const offset = (page - 1) * limit;

    const qb = this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('project.isActive = true')
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

  async getProjectApplications(
    projectId: string,
    userId: string,
    page: number = 1,
    limit: number = 10,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    this.validateProjectOwner(project, userId);

    limit = Math.min(limit, 50);

    const [applications, total] =
      await this.projectApplicationRepo.findAndCount({
        where: {
          project: { id: projectId },
        },
        relations: ['user', 'user.professionalRole', 'user.skills'],
        order: { createdAt: 'DESC' },
        take: limit,
        skip: (page - 1) * limit,
      });

    return {
      data: applications,
      meta: {
        total,
        page,
        limit,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async acceptApplication(applicationId: string, userId: string) {
    const application = await this.projectApplicationRepo.findOne({
      where: { id: applicationId },
      relations: ['project', 'project.owner', 'user'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.project.owner.id !== userId) {
      throw new ForbiddenException(
        'Only the project owner can accept applications',
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Application already processed');
    }

    const existingMember = await this.projectMemberRepo.findOne({
      where: {
        project: { id: application.project.id },
        user: { id: application.user.id },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a project member');
    }

    const member = this.projectMemberRepo.create({
      project: application.project,
      user: application.user,
    });

    await this.projectMemberRepo.save(member);

    application.status = ApplicationStatus.ACCEPTED;

    await this.projectApplicationRepo.save(application);

    return {
      message: 'Application accepted',
    };
  }

  async rejectApplication(applicationId: string, userId: string) {
    const application = await this.projectApplicationRepo.findOne({
      where: { id: applicationId },
      relations: ['project', 'project.owner', 'user'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    if (application.project.owner.id !== userId) {
      throw new ForbiddenException(
        'Only the project owner can accept applications',
      );
    }

    if (application.status !== ApplicationStatus.PENDING) {
      throw new BadRequestException('Application already processed');
    }

    const existingMember = await this.projectMemberRepo.findOne({
      where: {
        project: { id: application.project.id },
        user: { id: application.user.id },
      },
    });

    if (existingMember) {
      throw new BadRequestException('User is already a project member');
    }

    const member = this.projectMemberRepo.create({
      project: application.project,
      user: application.user,
    });

    await this.projectMemberRepo.save(member);

    application.status = ApplicationStatus.REJECTED;

    await this.projectApplicationRepo.save(application);

    return {
      message: 'Application rejected',
    };
  }

  async updateProject(
    projectId: string,
    userId: string,
    updateProjectDto: UpdateProjectDto,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    this.validateProjectOwner(project, userId);

    Object.assign(project, updateProjectDto);

    await this.projectRepo.save(project);

    return project;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    this.validateProjectOwner(project, userId);

    project.isActive = false;
    project.deletedAt = new Date();

    await this.projectRepo.save(project);

    return {
      message: 'Project archived successfully',
    };
  }

  async getProjectMembers(projectId: string) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId, isActive: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const members = await this.projectMemberRepo.find({
      where: { project: { id: projectId } },
      relations: ['user', 'user.professionalRole', 'user.skills'],
    });

    return members.map((member) => ({
      id: member.user.id,
      fullName: member.user.fullName,
      role: member.user.professionalRole?.name,
      skills: member.user.skills?.map((s) => s.name),
    }));
  }

  async getAppliedProjects(userId: string) {
    const applications = await this.projectApplicationRepo.find({
      where: {
        user: { id: userId },
      },
      relations: ['project', 'project.owner'],
      order: {
        createdAt: 'DESC',
      },
    });

    return applications.map((app) => ({
      applicationId: app.id,
      status: app.status,
      message: app.message,
      project: {
        id: app.project.id,
        title: app.project.title,
        status: app.project.status,
        owner: {
          id: app.project.owner.id,
          fullName: app.project.owner.fullName,
        },
      },
    }));
  }

  // TODO: basic version of discovery .. intelligent matching based, we can improve this later
  async discoverProjects(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['skills', 'professionalRole'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userSkills = user.skills.map((s) => s.name.toLowerCase());

    const qb = this.projectRepo
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.owner', 'owner')
      .where('project.isActive = true')
      .orderBy('project.createdAt', 'DESC');

    const projects = await qb.getMany();

    // simple scoring system
    const scored = projects.map((project) => {
      let score = 0;

      const techStack = project.techStack.map((t) => t.toLowerCase());

      // match by skills
      techStack.forEach((tech) => {
        if (userSkills.includes(tech)) {
          score += 2;
        }
      });

      // match by role 
      if (
        user.professionalRole &&
        project.description
          .toLowerCase()
          .includes(user.professionalRole.name.toLowerCase())
      ) {
        score += 1;
      }

      return {
        ...project,
        score,
      };
    });

    // order by revelance
    scored.sort((a, b) => b.score - a.score);

    return scored.slice(0, 20).map((project) => ({
      id: project.id,
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      score: project.score,
      owner: {
        id: project.owner.id,
        fullName: project.owner.fullName,
      },
    }));
  }
}
