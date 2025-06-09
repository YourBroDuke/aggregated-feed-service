import { PlatformDAO } from '../../dao/PlatformDAO.js';
import { PlatformDTO } from '../../dto/PlatformDTO.js';

export class PlatformService {
  private platformDAO: PlatformDAO;

  constructor(platformDAO: PlatformDAO) {
    this.platformDAO = platformDAO;
  }

  async getPlatforms(): Promise<PlatformDTO[]> {
    const platforms = await this.platformDAO.getPlatforms();
    return platforms;
  }
} 