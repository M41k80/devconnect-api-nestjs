import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('skills')
export class Skill {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the skill',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'JavaScript',
    description: 'Name of the skill',
  })
  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.skills)
  users: User[];
}
