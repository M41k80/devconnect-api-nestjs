import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { ProjectApplication } from './project-application.entity';
import { ProjectStatus } from '../enums/project-status.enum';
import { ApiProperty } from '@nestjs/swagger';
import { ProjectMember } from './project-member.entity';

@Entity('projects')
export class Project {
  @ApiProperty({
    description: 'Project ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Project title',
    example: 'My project',
  })
  @Column()
  title: string;

  @ApiProperty({
    description: 'Project description',
    example: 'This is my project description',
  })
  @Column({ type: 'text', nullable: false })
  description: string;

  @ApiProperty({
    example: 'react, angular, node, express',
    description: 'List of technologies used in the project',
  })
  @Column('text', { array: true, nullable: true })
  techStack: string[];

  @ApiProperty({
    example: 'https://github.com/devconnect/devconnect-api',
    description: 'URL of the project repository',
  })
  @Column({ nullable: true })
  repositoryUrl?: string;

  @ApiProperty({
    example: 'demo.devconnect.dev',
    description: 'URL of the project demo',
  })
  @Column({ nullable: true })
  demoUrl?: string;

  @ApiProperty({
    example: 'https://docs.devconnect.dev',
    description: 'URL of the project documentation',
  })
  @Column({ nullable: true })
  docsUrl?: string;

  @ApiProperty({
    example: 'Idea',
    description: 'Status of the project',
  })
  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.IDEA,
  })
  status: ProjectStatus;

  @ApiProperty({
    example: true,
    description: 'Whether the project is active or not',
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2023-07-01T00:00:00.000Z',
    description: 'Date when the project was deleted',
  })
  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;

  @ManyToOne(() => User, (user) => user.projectsOwned)
  owner: User;

  @OneToMany(() => ProjectMember, (member) => member.project)
  members: ProjectMember[];

  @OneToMany(() => ProjectApplication, (app) => app.project)
  applications: ProjectApplication[];

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the project was created',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: '2022-01-01T00:00:00.000Z',
    description: 'Date when the project was last updated',
  })
  @UpdateDateColumn()
  updatedAt: Date;
}
