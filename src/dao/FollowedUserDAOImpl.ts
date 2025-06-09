import { FollowedUserDAO } from './FollowedUserDAO';
import prisma from '../utils/prisma';
import { FollowedUserDTO } from '../interfaces/user.interface';

export class FollowedUserDAOImpl implements FollowedUserDAO {
  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    const users = await prisma.followedUser.findMany();
    return users.map(u => ({
      id: u.id,
      platform: u.platform,
      username: u.username,
      name: u.name,
      avatar: u.avatar,
      description: u.description,
      profileUrl: u.profileUrl,
      followedAt: u.followedAt,
      isActive: u.isActive,
    }));
  }

  async addFollowedUser(profileUrl: string): Promise<FollowedUserDTO> {
    const user = await prisma.followedUser.create({
      data: {
        profileUrl,
        platform: '',
        username: '',
        name: '',
        avatar: '',
        description: '',
        followedAt: new Date(),
        isActive: true,
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
      isActive: user.isActive,
    };
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    await prisma.followedUser.delete({ where: { id: userId } });
    return { success: true };
  }
} 