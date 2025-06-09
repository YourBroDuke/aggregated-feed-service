import { PlatformDTO } from '../dto/PlatformDTO';

export interface PlatformDAO {
  getPlatforms(): Promise<PlatformDTO[]>;
} 