import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { ReactivateAccountDto } from './dto/reactivate-account.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  create(data: Partial<User>) {
    const user = this.userRepo.create(data);
    return this.userRepo.save(user);
  }

  async findByEmail(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  findByIdWithRelations(id: string) {
    return this.userRepo.findOne({
      where: { id },
      relations: ['following', 'follower'],
    });
  }

  async reactivateAccount(reactivateAccountDto: ReactivateAccountDto) {
    const user = await this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: reactivateAccountDto.email })
      .withDeleted()
      .getOne();

    if (!user) {
      throw new NotFoundException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      reactivateAccountDto.password,
      user.password,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already active');
    }

    user.isActive = true;
    user.deletedAt = null;

    await this.userRepo.save(user);

    return {
      message: 'Account reactivated successfully',
    };
  }

  async deactivateUserAdmin(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Cannot deactivate admin');
    }

    user.isActive = false;
    user.deletedAt = new Date();

    await this.userRepo.save(user);

    return { message: 'User deactivated successfully' };
  }

  async deactivateUser(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    user.deletedAt = new Date();
    await this.userRepo.save(user);

    return {
      message: 'Account deactivated successfully',
    };
  }

  async updateUser(id: string, data: Partial<User>) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);

    return this.userRepo.save(user);
  }

  async findAll() {
    return this.userRepo.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findPublic(paginationQueryDto: PaginationQueryDto) {
    const { limit = 10, offset = 0, search } = paginationQueryDto;
    const query = this.userRepo
      .createQueryBuilder('user')
      .where('user.isActive = :isActive', { isActive: true });

    if (search) {
      query.andWhere('LOWER(user.fullName) LIKE LOWER (:search)', {
        search: `%${search}%`,
      });
    }

    query
      .select(['user.id', 'user.fullName', 'user.createdAt'])
      .orderBy('user.createdAt', 'DESC')
      .skip(offset)
      .take(limit);
    const [users, total] = await query.getManyAndCount();

    return {
      data: users,
      meta: {
        total,
        limit,
        offset,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async reactivateUser(id: string) {
    const user = await this.userRepo.findOne({
      where: { id: id },
      withDeleted: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isActive) {
      throw new BadRequestException('Account is already active');
    }

    user.isActive = true;
    user.deletedAt = undefined;

    await this.userRepo.save(user);

    return {
      message: 'Account reactivated successfully',
    };
  }
}
