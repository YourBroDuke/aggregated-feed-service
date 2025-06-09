import { PlatformDAO } from '../../dao/PlatformDAO';
import { PlatformDTO } from '../../interfaces/platform.interface';

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