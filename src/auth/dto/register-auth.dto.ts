import {
  IsEmail,
  IsString,
  MaxLength,
  MinLength,
  Matches,
  IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'Email of the user',
    required: true,
    nullable: false,
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'SuperUser123',
    description: 'The user password',
    required: true,
    nullable: false,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    example: 'Super User',
    description: 'The user full name',
    required: true,
    nullable: false,
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    example: 'uuid-of-professional-role',
    description: 'The user professional role id',
  })
  @IsUUID()
  professionalRoleId: string;
}
