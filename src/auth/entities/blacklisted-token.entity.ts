import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('blacklisted_tokens')
export class BlacklistedToken {
  @ApiProperty({
    description: 'Unique identifier',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Token to be blacklisted',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @Column('text')
  token: string;

  @ApiProperty({
    description: 'User who has blacklisted the token',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    description: 'Expiration date of the token',
    example: '2023-07-01T00:00:00.000Z',
  })
  @Column()
  expiresAt: Date;
}
