import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Follow } from './entities/follow.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class FollowsService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
  ) {}

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId) {
      throw new BadRequestException('You cannot follow yourself');
    }
    const follower = await this.usersRepo.findOneBy({ id: followerId });
    const following = await this.usersRepo.findOneBy({ id: followingId });

    if (!follower) {
      throw new NotFoundException('Follower user does not exist');
    }
    if (!following) {
      throw new NotFoundException('Followed user does not exist');
    }
    const exists = await this.followRepo.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });
    if (exists) {
      throw new BadRequestException('User already followed');
    }
    const follow = this.followRepo.create({
      follower,
      following,
    });
    return this.followRepo.save(follow);
  }

  async unfollow(followerId: string, followingId: string) {
    // DELETE api/follows/id
    const follow = await this.followRepo.findOneBy({
      follower: { id: followerId },
      following: { id: followingId },
    });

    if (!follow) {
      throw new NotFoundException('Follow relationship does not exist');
    }

    await this.followRepo.remove(follow);

    return { message: 'Unfollowed successfully' };
  }

  // GET api/users/:id/followers
  async getFollowers(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['follower', 'follower.follower'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.follower.map((f) => f.follower);
  }

  // GET api/users/:id/following
  async getFollowing(userId: string) {
    const user = await this.usersRepo.findOne({
      where: { id: userId },
      relations: ['following', 'following.following'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.following.map((f) => f.following);
  }
}
