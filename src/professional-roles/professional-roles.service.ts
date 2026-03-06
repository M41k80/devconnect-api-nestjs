import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProfessionalRole } from './entities/professional-role.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProfessionalRolesService {
  constructor(
    @InjectRepository(ProfessionalRole)
    private readonly roleRepo: Repository<ProfessionalRole>,
  ) {}

  async findAll() {
    return this.roleRepo.find();
  }

  findById(id: string) {
    return this.roleRepo.findOne({ where: { id } });
  }
}
