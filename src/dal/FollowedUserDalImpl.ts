import { IFollowedUserDal } from './IFollowedUserDal.js';
import { FollowedUserDTO } from '../dto/FollowedUserDTO.js';
import { FollowedUser } from '../models/FollowedUser.js';
import { Document } from 'mongoose';

export class FollowedUserDalImpl implements IFollowedUserDal {
  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    const users = await FollowedUser.find();
    return users.map((u: any) => ({
      id: u._id.toString(),
      platform: u.platform,
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      description: u.description,
      profileUrl: u.profileUrl,
      followedAt: u.followedAt,
    }));
  }

  async addFollowedUser(profileUrl: string): Promise<FollowedUserDTO> {
    const platform = this.extractPlatform(profileUrl);
    
    // Check if user already exists
    const existingUser = await FollowedUser.findOne({ profileUrl });
    if (existingUser) {
      const user = existingUser as Document & {
        _id: { toString(): string };
        platform: string;
        username: string;
        name: string;
        avatar: string;
        description: string;
        profileUrl: string;
        followedAt: Date;
      };
      
      return {
        id: user._id.toString(),
        platform: user.platform,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        description: user.description,
        profileUrl: user.profileUrl,
        followedAt: user.followedAt,
      };
    }

    const user = await FollowedUser.create({
      profileUrl,
      platform,
      username: '',
      name: '',
      avatar: '',
      description: '',
      followedAt: new Date(),
    });
    console.log(user);
    const user2 = user as Document & {
      _id: { toString(): string };
      platform: string;
      username: string;
      name: string;
      avatar: string;
      description: string;
      profileUrl: string;
      followedAt: Date;
    };
    
    return {
      id: user2._id.toString(),
      platform: user2.platform,
      username: user2.username,
      name: user2.name,
      avatar: user2.avatar,
      description: user2.description,
      profileUrl: user2.profileUrl,
      followedAt: user2.followedAt,
    };
  }

  private extractPlatform(profileUrl: string): string {
    const url = new URL(profileUrl);
    // example1: https://www.xiaohongshu.com/user/profile/666666666666666666666666 -> xiaohongshu
    // example2: https://www.twitter.com/user/1234567890 -> twitter
    return url.hostname.split('.')[1];
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    await FollowedUser.findByIdAndDelete(userId);
    return { success: true };
  }
} 