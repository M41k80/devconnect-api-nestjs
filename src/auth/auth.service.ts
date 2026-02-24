import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async register(registerDto: RegisterDto) {
    const exists = await this.usersService.findByEmail(registerDto.email);

    if (exists) throw new BadRequestException('User already exists');

    const hashed = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      fullName: registerDto.fullName,
      password: hashed,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    const match = await bcrypt.compare(loginUserDto.password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');

    return {
      message: 'Login success',
      userId: user.id,
    };
  }
}
