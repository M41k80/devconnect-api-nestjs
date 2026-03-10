import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MetadataController } from './metadata.controller';
import { MetadataService } from './metadata.service';

import { ProfessionalRole } from '../professional-roles/entities/professional-role.entity';
import { Skill } from '../skills/entities/skill.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalRole, Skill])],
  controllers: [MetadataController],
  providers: [MetadataService],
})
export class MetadataModule {}
