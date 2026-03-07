import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { CreateSkillDto } from './dto/create-skill.dto';

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

  async create(createSkillDto: CreateSkillDto) {
    const skill = this.skillRepo.create(createSkillDto);
    return this.skillRepo.save(skill);
  }

  async findAll() {
    return this.skillRepo.find();
  }

  findById(id: string) {
    return this.skillRepo.findOne({ where: { id } });
  }
}
