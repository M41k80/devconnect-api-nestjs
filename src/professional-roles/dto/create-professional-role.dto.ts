import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProfessionalRoleDto {
  @ApiProperty({ example: 'Frontend Developer' })
  @IsString()
  name: string;
}
