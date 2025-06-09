import { PlatformDAO } from './PlatformDAO';
import prisma from '../utils/prisma';
import { PlatformDTO } from '../dto/PlatformDTO';

export class PlatformDAOImpl implements PlatformDAO {
  async getPlatforms(): Promise<PlatformDTO[]> {
    const platforms = await prisma.platform.findMany();
    return platforms.map(p => ({
      id: p.id,
      name: p.name,
      icon: p.icon,
      color: p.color,
      backgroundColor: p.backgroundColor,
      domain: p.domain,
    }));
  }
} 