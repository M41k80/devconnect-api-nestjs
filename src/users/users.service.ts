import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from 'src/auth/enums/role.enum';

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

  async deactivateUser(id: string) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.role === Role.ADMIN) {
      throw new BadRequestException('Cannot deactivate admin');
    }

    user.isActive = false;

    await this.userRepo.save(user);

    return { message: 'User deactivated successfully' };
  }
}
