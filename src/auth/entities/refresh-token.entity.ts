import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('refresh_tokens')
export class RefreshToken {
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
  @Column()
  tokenHash: string;

  @ApiProperty({
    description: 'Expiration date of the token',
    example: '2023-07-01T00:00:00.000Z',
  })
  @Column()
  expiresAt: Date;

  @ApiProperty({
    description: 'Is the token revoked',
    example: true,
  })
  @Column('bool', { default: false })
  revoked: boolean;

  @ApiProperty({
    description: 'User who has blacklisted the token',
    example: '00000000-0000-0000-0000-000000000000',
  })
  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  user: User;

  @ApiProperty({
    description: 'Created at',
    example: '2023-07-01T00:00:00.000Z',
  })
  @CreateDateColumn()
  createdAt: Date;
}
