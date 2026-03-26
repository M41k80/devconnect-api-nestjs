import { Controller, Delete, Get } from '@nestjs/common';
import { Post, Param, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import type { AuthRequest } from 'src/auth/interface';
import { FollowsService } from './follows.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Follow a user' })
  @ApiResponse({
    status: 200,
    description: 'Followed user',
    type: User,
  })
  @Post(':id')
  follow(@Req() req: AuthRequest, @Param('id') id: string) {
    return this.followsService.followUser(req.user.id, id);
  }

  @ApiOperation({ summary: 'Unfollow a user' })
  @ApiResponse({
    status: 200,
    description: 'Unfollowed user',
    type: User,
  })
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async unfollow(@Param('id') followingId: string, @Req() req: AuthRequest) {
    const followerId = req.user.id;
    await this.followsService.unfollow(followerId, followingId);
    return { message: 'Unfollowed successfully' };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get followers of a user' })
  @ApiResponse({
    status: 200,
    description: 'Followers of a user',
    type: User,
  })
  @Get('/followers/:id')
  async getFollowers(@Param('id') userId: string) {
    const follower = await this.followsService.getFollowers(userId);
    return { follower };
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get following of a user' })
  @ApiResponse({
    status: 200,
    description: 'Following of a user',
    type: User,
  })
  @Get('/following/:id')
  async getFollowing(@Param('id') userId: string) {
    const following = await this.followsService.getFollowing(userId);
    return { following };
  }
}
