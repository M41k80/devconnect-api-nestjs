import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
  @ApiProperty({
    example: 'b9a1c8e2-5f1d-4c3e-9a1b-2d3f4e5a6b7c',
    description: 'The follow ID',
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.following, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  follower: User;

  @ManyToOne(() => User, (user) => user.follower, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  following: User;

  @ApiProperty({
    example: '2023-07-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
