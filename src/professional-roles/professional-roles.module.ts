import { Module } from '@nestjs/common';
import { ProfessionalRolesService } from './professional-roles.service';
import { ProfessionalRolesController } from './professional-roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfessionalRole } from './entities/professional-role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfessionalRole])],
  controllers: [ProfessionalRolesController],
  providers: [ProfessionalRolesService],
})
export class ProfessionalRolesModule {}
