import { IFollowedUserDal } from './IFollowedUserDal.js';
import prisma from '../utils/prisma.js';
import { FollowedUserDTO } from '../dto/FollowedUserDTO.js';

export class FollowedUserDalImpl implements IFollowedUserDal {
  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    const users = await prisma.followedUsers.findMany();
    return users.map(u => ({
      id: u.id,
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
    const user = await prisma.followedUsers.create({
      data: {
        profileUrl,
        platform: '',
        username: '',
        name: '',
        avatar: '',
        description: '',
        followedAt: new Date(),
      },
    });
    return {
      id: user.id,
      platform: user.platform,
      username: user.username,
      name: user.name,
      avatar: user.avatar,
      description: user.description,
      profileUrl: user.profileUrl,
      followedAt: user.followedAt,
    };
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    await prisma.followedUsers.delete({ where: { id: userId } });
    return { success: true };
  }
} 