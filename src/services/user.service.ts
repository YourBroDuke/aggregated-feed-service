import { IFollowedUserDal } from '../dal/IFollowedUserDal.js';
import { FollowedUserDTO } from '../dto/FollowedUserDTO.js';

export class UserService {
  private followedUserDal: IFollowedUserDal;

  constructor(followedUserDal: IFollowedUserDal) {
    this.followedUserDal = followedUserDal;
  }

  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    const users = await this.followedUserDal.getFollowedUsers();
    return users.map((u: FollowedUserDTO) => ({
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
    const result = await this.followedUserDal.addFollowedUser(profileUrl);
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
    };
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    const result = await this.followedUserDal.removeFollowedUser(userId);
    return { success: result.success };
  }
} 