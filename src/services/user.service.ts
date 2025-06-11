import { IFollowedUserDal } from '../dal/IFollowedUserDal.js';
import { FollowedUserDTO } from '../dto/FollowedUserDTO.js';

export class UserService {
  private followedUserDal: IFollowedUserDal;

  constructor(followedUserDal: IFollowedUserDal) {
    this.followedUserDal = followedUserDal;
  }

  async getFollowedUsers(): Promise<FollowedUserDTO[]> {
    return await this.followedUserDal.getFollowedUsers();
  }

  async addFollowedUser(profileUrl: string): Promise<FollowedUserDTO> {
    return await this.followedUserDal.addFollowedUser(profileUrl);
  }

  async removeFollowedUser(userId: string): Promise<{ success: boolean }> {
    return await this.followedUserDal.removeFollowedUser(userId);
  }
} 