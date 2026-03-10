import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  Req,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReactivateAccountDto } from './dto/reactivate-account.dto';
import type { AuthRequest } from 'src/auth/interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { Role } from 'src/auth/enums/role.enum';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
    console.log('UsersController initialized', usersService);
  }

  @Get()
  @ApiOperation({ summary: 'Get public users list' })
  @ApiResponse({ status: 200, description: 'Public users list' })
  getPublicUsers(@Query() paginationQueryDto: PaginationQueryDto) {
    return this.usersService.findPublic(paginationQueryDto);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all users (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of all users' })
  getAllUsers() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getProfile(@Req() req: AuthRequest) {
    return req.user;
  }

  @Patch('updateProfile')
  @UseGuards(JwtAuthGuard)
  updateProfile(@Req() req: AuthRequest, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.id, updateUserDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  getUser(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('deactivate')
  @ApiOperation({ summary: 'Deactivate own account' })
  deactivate(@Request() req: AuthRequest) {
    return this.usersService.deactivateUser(req.user.id);
  }

  @Patch('reactivate')
  @ApiOperation({ summary: 'Reactivate account' })
  reactivate(@Body() reactivateAccountDto: ReactivateAccountDto) {
    return this.usersService.reactivateAccount(reactivateAccountDto);
  }
}
