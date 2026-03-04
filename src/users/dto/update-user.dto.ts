import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

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
}
