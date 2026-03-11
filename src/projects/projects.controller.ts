import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Get,
  Param,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/interface';
import { GetProjectsDto } from './dto/get-projects.dto';
import { ApplyProjectDto } from './dto/apply-project.dto';
@ApiTags('Projects')
@ApiResponse({
  status: 201,
  description: 'Project created successfully',
})
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
  })
  @ApiResponse({
    status: 201,
    description: 'Project created successfully',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createProject(
    @Req() req: AuthRequest,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(req.user.id, createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get projects',
  })
  getProjects(@Query() paginationQueryDto: GetProjectsDto) {
    return this.projectsService.getProjects(paginationQueryDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get project by id',
  })
  getProjectById(@Param('id') id: string) {
    return this.projectsService.getProjectById(id);
  }

  @Post(':id/apply')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Apply to a project',
  })
  @ApiBearerAuth()
  applyToProject(
    @Param('id') projectId: string,
    @Req() req: AuthRequest,
    @Body() applyProjectDto: ApplyProjectDto,
  ) {
    return this.projectsService.applyToProject(
      req.user.id,
      projectId,
      applyProjectDto,
    );
  }
}
