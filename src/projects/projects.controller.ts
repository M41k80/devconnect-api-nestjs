import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Get,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
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
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectResponseDto } from './dto/responses/project-response.dto';
import { PaginationDto } from './dto/pagination/pagination.dto';
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
    type: ProjectResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createProject(
    @Req() req: AuthRequest,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<ProjectResponseDto> {
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

  @Get(':id/applications')
  @ApiOperation({
    summary: 'Get project applications',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getProjectApplications(
    @Param('id') projectId: string,
    @Query() paginationQueryDto: PaginationDto,
    @Req() req: AuthRequest,
  ) {
    return this.projectsService.getProjectApplications(
      projectId,
      req.user.id,
      paginationQueryDto.page,
      paginationQueryDto.limit,
    );
  }

  @Patch('applications/:id/accept')
  @ApiOperation({
    summary: 'Accept application',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  acceptApplication(
    @Param('id') applicationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.projectsService.acceptApplication(applicationId, req.user.id);
  }

  @Patch('applications/:id/reject')
  @ApiOperation({
    summary: 'Reject application',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  rejectApplication(
    @Param('id') applicationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.projectsService.rejectApplication(applicationId, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update project',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  updateProject(
    @Param('id') projectId: string,
    @Req() req: AuthRequest,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      projectId,
      req.user.id,
      updateProjectDto,
    );
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete project',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  deleteProject(@Param('id') projectId: string, @Req() req: AuthRequest) {
    return this.projectsService.deleteProject(projectId, req.user.id);
  }
}
