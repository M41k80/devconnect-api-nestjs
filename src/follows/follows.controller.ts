import { Controller, Delete, Get } from '@nestjs/common';
import { Post, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/interface';
import { FollowsService } from './follows.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

@ApiTags('Follows')
@ApiResponse({
  status: 200,
  description: 'Followed user',
  type: User,
})
@ApiResponse({
  status: 400,
  description: 'Bad request',
})
@ApiResponse({
  status: 401,
  description: 'Unauthorized',
})
@ApiResponse({
  status: 404,
  description: 'User not found',
})
@Controller('follows')
export class FollowsController {
  constructor(private followsService: FollowsService) {}
  @UseGuards(JwtAuthGuard)
  @Post(':id')
  follow(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.followsService.followUser(req.user.sub, id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id') followingId: string, @Req() req: AuthRequest) {
    const followerId = req.user.sub;
    await this.followsService.unfollow(followerId, followingId);
    return { message: 'Unfollowed successfully' };
  }

  @Get('/users/:id/followers')
  async getFollowers(@Param('id') userId: string) {
    const follower = await this.followsService.getFollowers(userId);
    return { follower };
  }

  @Get('/users/:id/following')
  async getFollowing(@Param('id') userId: string) {
    const following = await this.followsService.getFollowing(userId);
    return { following };
  }
}
