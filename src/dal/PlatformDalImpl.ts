import { IPlatformDal } from './IPlatformDal.js';
import prisma from '../utils/prisma.js';
import { PlatformDTO } from '../dto/PlatformDTO.js';

export class PlatformDalImpl implements IPlatformDal {
  async getPlatforms(): Promise<PlatformDTO[]> {
    const platforms = await prisma.platforms.findMany();
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