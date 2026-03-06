import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities';
import { User } from 'src/users/entities/user.entity';
import { ProfessionalRole } from 'src/professional-roles/entities/professional-role.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    @InjectRepository(BlacklistedToken)
    private repo: Repository<BlacklistedToken>,
    @InjectRepository(RefreshToken)
    private refreshRepo: Repository<RefreshToken>,
    @InjectRepository(ProfessionalRole)
    private readonly professionalRoleRepo: Repository<ProfessionalRole>,
  ) {}

  async register(registerDto: RegisterDto) {
    const exists = await this.usersService.findByEmail(registerDto.email);

    if (exists) {
      throw new BadRequestException('User already exists');
    }

    const role = await this.professionalRoleRepo.findOne({
      where: { id: registerDto.professionalRoleId },
    });

    if (!role) {
      throw new BadRequestException('Invalid professional role');
    }

    const hashed = await bcrypt.hash(registerDto.password, 10);

    const user = await this.usersService.create({
      email: registerDto.email,
      fullName: registerDto.fullName,
      password: hashed,
      professionalRole: role,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      professionalRole: role.name,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.usersService.findByEmail(loginUserDto.email);

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if (user.deletedAt) {
      throw new BadRequestException('Account deactivated');
    }

    const match = await bcrypt.compare(loginUserDto.password, user.password);

    if (!match) throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.issueTokens(user);

    await this.saveRefreshToken(user.id, tokens.refreshToken);

    return {
      message: 'Login success',
      ...tokens,
      userId: user.id,
      fullName: user.fullName,
    };
  }

  async verifyRefreshToken(refreshToken: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: process.env.JWT_SECRET,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  generateAccessToken(user: JwtPayload) {
    return this.jwtService.sign(user);
  }

  async getUserById(id: string) {
    return await this.usersService.findById(id);
  }

  async add(token: string, expiresAt: Date) {
    const record = this.repo.create({ token, expiresAt });
    return this.repo.save(record);
  }

  async isBlacklisted(token: string): Promise<boolean> {
    const exists = await this.repo.findOneBy({ token });
    return !!exists;
  }

  async saveRefreshToken(userId: string, token: string) {
    const hashed = await bcrypt.hash(token, 10);

    const expireAt = new Date();
    expireAt.setDate(expireAt.getDate() + 7);

    const refresh = this.refreshRepo.create({
      tokenHash: hashed,
      user: { id: userId },
      expiresAt: expireAt,
    });

    await this.refreshRepo.save(refresh);
  }

  async refresh(token: string) {
    try {
      const payload = this.jwtService.verify<JwtPayload>(token);

      const user = await this.usersService.findById(payload.sub);

      if (!user) throw new UnauthorizedException();

      const savedTokens = await this.refreshRepo.find({
        where: { user: { id: user.id } },
      });

      let validToken: RefreshToken | null = null;

      for (const dbToken of savedTokens) {
        if (dbToken.revoked) continue;
        if (dbToken.expiresAt < new Date()) continue;
        const isValid = await bcrypt.compare(token, dbToken.tokenHash);
        if (isValid) {
          validToken = dbToken;
          break;
        }
      }

      if (!validToken) throw new UnauthorizedException();

      if (validToken.expiresAt < new Date()) {
        throw new UnauthorizedException();
      }

      validToken.revoked = true;
      await this.refreshRepo.save(validToken);

      const tokens = await this.issueTokens(user);
      return {
        message: 'Token refreshed',
        ...tokens,
        userId: user.id,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async issueTokens(user: User) {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '30m',
    });

    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: '7d' },
    );

    await this.saveRefreshToken(user.id, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async revokeAllUserRefreshTokens(userId: string) {
    await this.refreshRepo
      .createQueryBuilder()
      .update()
      .set({ revoked: true })
      .where('userId = :userId', { userId })
      .execute();
  }
}
