import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
  };

  const mockUsersService = {
    findByEmail: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  
  describe('register', () => {
    it('should call authService.register', async () => {
      const dto = {
        email: 'test@test.com',
        fullName: 'Test User',
        password: '123456',
      };
      mockAuthService.register.mockResolvedValue({
        id: '1',
        email: dto.email,
        fullName: dto.fullName,
      });

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual({
        id: '1',
        email: dto.email,
        fullName: dto.fullName,
      });
    });
  });

 
  describe('login', () => {
    it('should call authService.login and set cookie', async () => {
      const dto = { email: 'test@test.com', password: '123456' };
      const serviceResult = {
        message: 'Login success',
        accessToken: 'access',
        refreshToken: 'refresh',
        userId: '1',
        fullName: 'Test User',
      };
      const loginResult = { message: 'Login success' }; // <- lo que realmente devuelve el controlador

      mockAuthService.login.mockResolvedValue(serviceResult);

      const resMock = {
        cookie: jest.fn(),
      };

      const result = await controller.login(dto, resMock as any);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(resMock.cookie).toHaveBeenCalledWith(
        'token',
        'access',
        expect.objectContaining({
          httpOnly: true,
          secure: expect.any(Boolean),
          sameSite: 'lax',
        }),
      );
      expect(result).toEqual(loginResult);
    });
  });

  
 describe('refresh', () => {
  it('should call authService.refresh and return new token', async () => {
    const cookieToken = 'refresh-token';
    const reqMock = { cookies: { refreshToken: cookieToken } };
    const serviceResult = { accessToken: 'new-access-token', message: 'Access token refreshed' };

    mockAuthService.refresh.mockResolvedValue(serviceResult);

    const result = await controller.refresh(reqMock as any);

    expect(authService.refresh).toHaveBeenCalledWith(cookieToken);
    expect(result).toEqual(serviceResult);
  });

  it('should throw UnauthorizedException if no refresh token', async () => {
    const reqMock = { cookies: {} }; // <- simula request sin token

    await expect(controller.refresh(reqMock as any)).rejects.toThrow('No refresh token');
  });
});
});
