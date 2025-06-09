import { FollowedUserDTO } from '../dto/FollowedUserDTO';

export interface FollowedUserDAO {
  getFollowedUsers(): Promise<FollowedUserDTO[]>;
  addFollowedUser(profileUrl: string): Promise<FollowedUserDTO>;
  removeFollowedUser(userId: string): Promise<{ success: boolean }>;
} 