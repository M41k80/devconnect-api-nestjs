import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfessionalRole } from '../../professional-roles/entities/professional-role.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(ProfessionalRole)
    private roleRepo: Repository<ProfessionalRole>,

    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  async onApplicationBootstrap() {
    await this.seedRoles();
    await this.seedSkills();
  }

  private async seedRoles() {
    const roles = [
      'Frontend Developer',
      'Backend Developer',
      'Fullstack Developer',
      'Mobile Developer',
      'DevOps',
      'QA Engineer',
      'UI/UX Designer',
      'Project Manager',
      'Data Scientist',
      'Software Engineer',
      'Technical Writer',
      'Content Writer',
      'Marketing',
      'Business Analyst',
      'Product Manager',
      'Sales',
      'Designer',
    ];

    for (const name of roles) {
      const exists = await this.roleRepo.findOne({ where: { name } });

      if (!exists) {
        await this.roleRepo.save({ name });
      }
    }
  }

  private async seedSkills() {
    const skills = [
      'JavaScript',
      'TypeScript',
      'React',
      'FastAPI',
      'Next.js',
      'Node.js',
      'NestJS',
      'Python',
      'Django',
      'PostgreSQL',
      'Docker',
      'AWS',
      'Laravel',
      'PHP',
      'Figma',
      'Testing',
      'Git',
      'GitHub',
      'HTML',
      'CSS',
      'Sass',
      'Bootstrap',
      'Material UI',
      'Tailwind CSS',
      'Express',
      'MongoDB',
      'MySQL',
      'SQL',
      'NoSQL',
      'Firebase',
      'Kubernetes',
    ];

    for (const name of skills) {
      const exists = await this.skillRepo.findOne({ where: { name } });

      if (!exists) {
        await this.skillRepo.save({ name });
      }
    }
  }
}
