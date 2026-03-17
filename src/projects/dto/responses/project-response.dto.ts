import { ApiProperty } from '@nestjs/swagger';

class OwnerDto {
  @ApiProperty({
    example: 'a2c5f9a0-b9d2-4a4c-a8a7-d8f0a6c2b7b3',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name',
  })
  fullName: string;
}

export class ProjectResponseDto {
  @ApiProperty({
    example: 'a2c5f9a0-b9d2-4a4c-a8a7-d8f0a6c2b7b3',
  })
  id: string;

  @ApiProperty({
    example: 'DevConnect',
  })
  title: string;

  @ApiProperty({
    example: 'A platform where developers can collaborate...',
  })
  description: string;

  @ApiProperty({
    example: ['NextJS', 'NestJS', 'PostgreSQL'],
    required: false,
  })
  techStack?: string[];

  @ApiProperty({ type: OwnerDto })
  owner: OwnerDto;
}
