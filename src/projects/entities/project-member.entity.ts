import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('project_members')
export class ProjectMember {
  @ApiProperty({
    description: 'Project Member ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.projectMemberships)
  user: User;

  @ManyToOne(() => Project, (project) => project.members)
  project: Project;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the project member joined the project',
  })
  @CreateDateColumn()
  joinedAt: Date;
}
