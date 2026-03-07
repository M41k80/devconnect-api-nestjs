import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('professional_roles')
export class ProfessionalRole {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'Unique identifier of the professional role',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Developer',
    description: 'Name of the professional role',
  })
  @Column({ unique: true })
  name: string;

  @ApiProperty({
    example: 'developer backend engineer expert in react',
    description: 'Description of the professional role',
  })
  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => User, (user) => user.professionalRole)
  users: User[];
}
