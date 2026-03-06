import { Controller, Get } from '@nestjs/common';
import { ProfessionalRolesService } from './professional-roles.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Professional Roles')
@Controller('professional-roles')
export class ProfessionalRolesController {
  constructor(private readonly rolesService: ProfessionalRolesService) {}

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}
