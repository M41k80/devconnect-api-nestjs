import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProfessionalRole } from '../professional-roles/entities/professional-role.entity';
import { Skill } from '../skills/entities/skill.entity';

@Injectable()
export class MetadataService {
  constructor(
    @InjectRepository(ProfessionalRole)
    private roleRepo: Repository<ProfessionalRole>,

    @InjectRepository(Skill)
    private skillRepo: Repository<Skill>,
  ) {}

  async getRegisterMetadata() {
    const roles = await this.roleRepo.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    const skills = await this.skillRepo.find({
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });

    return {
      professionalRoles: roles,
      skills: skills,
    };
  }
}
