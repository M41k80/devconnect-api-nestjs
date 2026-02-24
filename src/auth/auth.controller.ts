import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginUserDto } from './dto/login-auth.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { Req, UseGuards } from '@nestjs/common';
import type { AuthRequest } from './interface/index';
import { UnauthorizedException } from '@nestjs/common';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: 'Login Successful' })
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.login(loginUserDto);

    res.cookie('token', data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 1000 * 60 * 30),
    });
    res.cookie('refreshToken', data.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    return { message: data.message };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies['refreshToken'] as string | undefined;

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const payload = await this.authService.verifyRefreshToken(refreshToken);

      const user = await this.authService.getUserById(payload.sub);
      if (!user) throw new UnauthorizedException('User not found');

      const newAccessToken = this.authService.generateAccessToken({
        sub: user.id,
        email: user.email,
      });

      res.cookie('token', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 60 * 30),
      });

      return { message: 'Access token refreshed' };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }
}
