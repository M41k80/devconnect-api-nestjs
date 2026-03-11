import {
  IsOptional,
  IsEnum,
  IsString,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ProjectStatus } from '../enums/project-status.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetProjectsDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit?: number = 10;

  @ApiPropertyOptional({ example: ['NestJS', 'NextJS'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }: { value: string | string[] }) =>
    typeof value === 'string' ? [value] : value,
  )
  tech?: string[];

  @ApiPropertyOptional({ enum: ProjectStatus })
  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @ApiPropertyOptional({ example: 'DevConnect' })
  @IsOptional()
  @IsString()
  search?: string;
}
