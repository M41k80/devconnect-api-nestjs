import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @ApiProperty({
    default: 10,
    description: 'The pagination limit',
    required: false,
  })
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    default: 0,
    description: 'The pagination offset',
    required: false,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  offset?: number;

  @ApiProperty({
    default: false,
    description: 'search by name',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;
}
