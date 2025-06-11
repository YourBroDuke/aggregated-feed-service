import { IPlatformDal } from './IPlatformDal.js';
import { PlatformDTO } from '../dto/PlatformDTO.js';
import { Platform } from '../models/Platform.js';

export class PlatformDalImpl implements IPlatformDal {
  async getPlatforms(): Promise<PlatformDTO[]> {
    const platforms = await Platform.find();
    return platforms.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      type: p.type,
      icon: p.icon,
      color: p.color,
      backgroundColor: p.backgroundColor,
      domain: p.domain,
    }));
  }
} 