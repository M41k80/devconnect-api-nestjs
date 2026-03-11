import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ApplyProjectDto {
  @ApiPropertyOptional({
    example: 'I would love to help with the backend APIs',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  message?: string;
}
