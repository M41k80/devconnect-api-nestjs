import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { ProfessionalRolesModule } from 'src/professional-roles/professional-roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ProfessionalRolesModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
