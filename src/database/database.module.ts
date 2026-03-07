import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProfessionalRole } from '../professional-roles/entities/professional-role.entity';
import { Skill } from '../skills/entities/skill.entity';

import { SeedService } from './seeders/seed.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalRole, Skill])],
  providers: [SeedService],
})
export class DatabaseModule {}
