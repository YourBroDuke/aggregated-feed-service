import { FollowedUserDTO } from '../dto/FollowedUserDTO.js';

export interface IFollowedUserDal {
  getFollowedUsers(): Promise<FollowedUserDTO[]>;
  addFollowedUser(profileUrl: string): Promise<FollowedUserDTO>;
  removeFollowedUser(userId: string): Promise<{ success: boolean }>;
} 