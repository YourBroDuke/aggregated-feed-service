import { FastifyInstance } from 'fastify';
import { FeedItemDAOImpl } from '../../dao/FeedItemDAOImpl';
import { FeedItemDTO } from '../../dto/FeedItemDTO';
import { FeedService } from './feed.service';

export default async function routes(fastify: FastifyInstance, options: any) {
  const feedItemDAO = new FeedItemDAOImpl();
  const feedService = new FeedService(feedItemDAO);

  fastify.get('/api/feed', async (request, reply) => {
    const query = request.query as any;
    // 参数转换
    const params = {
      platforms: query.platforms ? query.platforms.split(',') : undefined,
      timeRange: query.timeRange,
      sortBy: query.sortBy,
      page: query.page ? parseInt(query.page) : 1,
      pageSize: query.pageSize ? parseInt(query.pageSize) : 20,
    };
    const items: FeedItemDTO[] = await feedService.getFeedItems(params);
    return items;
  });
} 