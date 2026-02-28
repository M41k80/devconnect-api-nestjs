import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { RequestWithCookies } from '../../interface/resquest-with-cookies.interface';
import { UsersService } from '../../../users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { JwtPayloadWithExp } from 'src/auth/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private authservice: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: RequestWithCookies) => {
          return req.cookies?.token ?? null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayloadWithExp, req: RequestWithCookies) {
    const token = req.cookies?.token;
    console.log('Payload:', payload);
    if (token && (await this.authservice.isBlacklisted(token))) {
      throw new UnauthorizedException('Token invalidated');
    }
    const user = await this.usersService.findByIdWithRelations(payload.sub);
    console.log('User found:', user);

    if (!user || !user.isActive) {
      throw new UnauthorizedException();
    }

    return {
      ...user,
      exp: payload.exp,
    };
  }
}
