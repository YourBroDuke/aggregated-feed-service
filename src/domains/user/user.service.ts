import { FollowedUserDAO } from '../../dao/FollowedUserDAO.js';
import { FollowedUserDTO } from '../../dto/FollowedUserDTO.js';

export class UserService {
  private followedUserDAO: FollowedUserDAO;

  constructor(followedUserDAO: FollowedUserDAO) {
    this.followedUserDAO = followedUserDAO;
  }

  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    const users = await this.followedUserDAO.getFollowedUsers();
    return users.map((u: FollowedUserDTO) => ({
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
    const result = await this.followedUserDAO.addFollowedUser(profileUrl);
    if (!result) throw new Error('Failed to add followed user');
    return {
      id: result.id,
      platform: result.platform,
      username: result.username,
      name: result.name,
      avatar: result.avatar,
      description: result.description,
      profileUrl: result.profileUrl,
      followedAt: result.followedAt,
      isActive: result.isActive,
    };
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    const result = await this.followedUserDAO.removeFollowedUser(userId);
    return { success: result.success };
  }
} 