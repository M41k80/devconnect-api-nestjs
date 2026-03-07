import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinTable,
  JoinColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Follow } from '../../follows/entities/follow.entity';
import { Role } from '../../auth/enums/role.enum';
import { RefreshToken } from '../../auth/entities/index';
import { ProfessionalRole } from '../../professional-roles/entities/professional-role.entity';
import { Skill } from '../../skills/entities/skill.entity';

@Entity('users')
export class User {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the user',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
  })
  @Column('text', { unique: true, nullable: false })
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: 'Password of the user',
    writeOnly: true,
  })
  @Column('text', { nullable: false, select: false })
  password: string;

  @ApiProperty({
    example: 'github.com/johndoe',
    description: 'Github username of the user',
  })
  @Column({ nullable: true })
  github: string;

  @ApiProperty({
    example: 'example.com/portfolio',
    description: 'Portfolio of the user',
  })
  @Column({ nullable: true })
  portfolio: string;

  @ApiProperty({
    example: 'linkedin.com/johndoe',
    description: 'Linkedin username of the user',
  })
  @Column({ nullable: true })
  linkedin: string;

  @ApiProperty({
    example: 'Im a developer and I love to code',
    description: 'Biography of the user',
  })
  @Column({ type: 'text', nullable: true })
  bio: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Name of the user',
  })
  @Column('text', { nullable: false })
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'Is the user active',
  })
  @Column('bool', { default: true })
  isActive: boolean;

  @ApiProperty({
    example: '2023-07-01T00:00:00.000Z',
  })
  @DeleteDateColumn()
  deletedAt?: Date;

  @ApiProperty({
    example: '2023-07-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: Role.USER,
  })
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.USER,
  })
  role: Role;

  @ApiProperty({
    example: '2023-07-01T00:00:00.000Z',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiHideProperty()
  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @ApiHideProperty()
  @OneToMany(() => Follow, (follow) => follow.following)
  follower: Follow[];

  @ApiHideProperty()
  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];

  @ManyToOne(() => ProfessionalRole, (role) => role.users, { eager: true })
  @JoinColumn({ name: 'professional_role_id' })
  professionalRole: ProfessionalRole;

  @ManyToMany(() => Skill, (skill) => skill.users, { eager: true })
  @JoinTable({ name: 'user_skills' })
  skills: Skill[];
}
