import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Project } from './project.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ApplicationStatus } from '../enums/application-status.enum';

@Entity('project_applications')
export class ProjectApplication {
  @ApiProperty({
    description: 'Project Application ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'pending',
    description: 'Status of the project application',
  })
  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @ApiProperty({
    example: 'message',
    description: 'Message of the project application',
  })
  @Column('text', { nullable: true })
  message: string;

  @ManyToOne(() => User, (user) => user.applications)
  user: User;

  @ManyToOne(() => Project, (project) => project.applications)
  project: Project;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the project application was created',
  })
  @CreateDateColumn()
  createdAt: Date;
}
