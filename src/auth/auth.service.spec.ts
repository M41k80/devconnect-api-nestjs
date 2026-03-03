import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlacklistedToken } from './entities/blacklisted-token.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verifyAsync: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(BlacklistedToken),
          useValue: {
            findOneBy: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(RefreshToken),
          useValue: {
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create a user successfully', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      (usersService.create as jest.Mock).mockResolvedValue({
        id: '1',
        email: 'a@b.com',
        fullName: 'Test',
      });

      const result = await service.register({
        email: 'a@b.com',
        fullName: 'Test',
        password: 'pass',
      });
      expect(result).toEqual({ id: '1', email: 'a@b.com', fullName: 'Test' });
    });

    it('should throw if user exists', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue({ id: '1' });
      await expect(
        service.register({
          email: 'a@b.com',
          fullName: 'Test',
          password: 'pass',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const user = {
        id: '1',
        email: 'a@b.com',
        fullName: 'Test',
        password: await bcrypt.hash('pass', 10),
        role: 'USER',
      };
      (usersService.findByEmail as jest.Mock).mockResolvedValue(user);
      (service['jwtService'].sign as jest.Mock).mockReturnValue('token');
      (service as any).saveRefreshToken = jest.fn();

      const result = await service.login({
        email: 'a@b.com',
        password: 'pass',
      });
      expect(result.accessToken).toBe('token');
      expect(result.refreshToken).toBeDefined();
    });

    it('should throw for invalid credentials', async () => {
      (usersService.findByEmail as jest.Mock).mockResolvedValue(null);
      await expect(
        service.login({ email: 'a@b.com', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refresh', () => {
    it('should throw if invalid token', async () => {
      (service['jwtService'].verify as jest.Mock).mockImplementation(() => {
        throw new Error();
      });
      await expect(service.refresh('token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
