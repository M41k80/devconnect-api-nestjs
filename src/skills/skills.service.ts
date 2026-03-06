import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private readonly skillRepo: Repository<Skill>,
  ) {}

  async findByNames(names: string[]) {
    return this.skillRepo
      .createQueryBuilder('skill')
      .where('skill.name IN (:...names)', { names })
      .getMany();
  }
}
