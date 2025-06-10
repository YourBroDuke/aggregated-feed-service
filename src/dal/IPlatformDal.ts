import { PlatformDTO } from '../dto/PlatformDTO.js';

export interface IPlatformDal {
  getPlatforms(): Promise<PlatformDTO[]>;
} 