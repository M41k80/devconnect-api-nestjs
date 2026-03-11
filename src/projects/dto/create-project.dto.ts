import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  MaxLength,
  ArrayMaxSize,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProjectStatus } from '../enums/project-status.enum';

export class CreateProjectDto {
  @ApiProperty({
    example: 'DevConnect',
    description: 'Project title',
  })
  @IsString()
  @MaxLength(100)
  title: string;

  @ApiProperty({
    example: 'A platform where developers can collaborate on real projects.',
    description: 'Project description',
  })
  @IsString()
  @MaxLength(2000)
  description: string;

  @ApiPropertyOptional({
    example: ['NextJS', 'NestJS', 'PostgreSQL'],
    description: 'Technologies used in the project',
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  techStack?: string[];

  @ApiPropertyOptional({
    example: 'https://github.com/devconnect/app',
    description: 'Repository URL',
  })
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiPropertyOptional({
    example: 'https://devconnect.app',
    description: 'Live demo URL',
  })
  @IsOptional()
  @IsUrl()
  demoUrl?: string;

  @ApiPropertyOptional({
    example: 'https://docs.devconnect.app',
    description: 'Project documentation URL',
  })
  @IsOptional()
  @IsUrl()
  docsUrl?: string;

  @ApiPropertyOptional({
    example: 'building',
    enum: ProjectStatus,
  })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;
}
