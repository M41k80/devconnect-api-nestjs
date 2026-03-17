import {
  IsOptional,
  IsString,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';

export class UpdateProjectDto {
  @ApiPropertyOptional({ example: 'DevConnect' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  title?: string;

  @ApiPropertyOptional({
    example: 'Platform for developers to collaborate',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({
    example: ['NestJS', 'NextJS', 'PostgreSQL'],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({
    example: 'https://github.com/devconnect/app',
  })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiPropertyOptional({
    example: 'https://devconnect.app',
  })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({
    enum: ProjectStatus,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
