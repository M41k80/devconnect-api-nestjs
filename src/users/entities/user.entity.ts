import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Follow } from '../../follows/entities/follow.entity';
import { Role } from '../../auth/enums/role.enum';
import { RefreshToken } from '../../auth/entities/index';

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
  @Column({ type: 'timestamp', nullable: true })
  deletedAt?: Date | null;

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

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  follower: Follow[];

  @OneToMany(() => RefreshToken, (token) => token.user)
  refreshTokens: RefreshToken[];
}
