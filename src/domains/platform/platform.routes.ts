import { FastifyInstance } from 'fastify';
import { PlatformDAOImpl } from '../../dao/PlatformDAOImpl';
import { PlatformService } from './platform.service';

export default async function routes(fastify: FastifyInstance, options: any) {
  const platformDAO = new PlatformDAOImpl();
  const platformService = new PlatformService(platformDAO);

  fastify.get('/api/platforms', async (request, reply) => {
    const platforms = await platformService.getPlatforms();
    return platforms;
  });
} 