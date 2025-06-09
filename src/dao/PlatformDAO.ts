import { PlatformDTO } from '../dto/PlatformDTO.js';

export interface PlatformDAO {
  getPlatforms(): Promise<PlatformDTO[]>;
} 