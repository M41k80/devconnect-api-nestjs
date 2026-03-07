import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ProfessionalRolesService } from './professional-roles.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { CreateProfessionalRoleDto } from './dto/create-professional-role.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';

@ApiTags('Professional Roles')
@Controller('professional-roles')
export class ProfessionalRolesController {
  constructor(private readonly rolesService: ProfessionalRolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all professional roles' })
  @ApiResponse({ status: 200, description: 'Success' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create professional role' })
  @ApiResponse({ status: 201, description: 'Created' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  create(@Body() createProfessionalDto: CreateProfessionalRoleDto) {
    return this.rolesService.create(createProfessionalDto);
  }
}
