import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @MinLength(2)
  fullName?: string;

  @ApiProperty({
    example: 'Backend Developer passionate about APIs',
  })
  @IsOptional()
  @IsString()
  @MaxLength(350)
  bio?: string;

  @ApiPropertyOptional({
    example: 'https://github.com/johndoe',
  })
  @IsOptional()
  @IsUrl()
  github?: string;

  @ApiPropertyOptional({
    example: 'https://johndoe.dev',
  })
  @IsOptional()
  @IsUrl()
  portfolio?: string;

  @ApiPropertyOptional({
    example: 'https://linkedin.com/in/johndoe',
  })
  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @ApiPropertyOptional({
    example: 'Madrid, Spain',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiPropertyOptional({
    example: 'https://avatars.githubusercontent.com/u/123456789?v=4',
  })
  @IsOptional()
  @IsString()
  profileImageUrl?: string;
}
