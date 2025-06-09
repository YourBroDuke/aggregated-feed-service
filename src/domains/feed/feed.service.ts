import { FeedItemDAO } from '../../dao/FeedItemDAO';
import { FeedItemDTO } from '../../interfaces/feed.interface';
import { Prisma } from '@prisma/client';

export class FeedService {
  private feedItemDAO: FeedItemDAO;

  constructor(feedItemDAO: FeedItemDAO) {
    this.feedItemDAO = feedItemDAO;
  }

  private buildFeedQuery(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    sortBy?: 'newest' | 'popular' | 'engagement';
    page?: number;
    pageSize?: number;
  }): Prisma.FeedItemWhereInput {
    const q: Prisma.FeedItemWhereInput = {};
    if (params.platforms) {
      q.platform = { in: params.platforms };
    }
    if (params.timeRange && params.timeRange !== 'all') {
      const now = new Date();
      let from: Date | undefined;
      if (params.timeRange === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (params.timeRange === 'week') {
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (params.timeRange === 'month') {
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (from) q.postedAt = { gte: from };
    }

    return q;
  }

  async getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    sortBy?: 'newest' | 'popular' | 'engagement';
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]> {
    const items = await this.feedItemDAO.getFeedItems({
      platforms: params.platforms,
      timeRange: params.timeRange,
      sortBy: params.sortBy,
      page: params.page || 1,
      pageSize: params.pageSize || 20,
    });
    // 转换为 DTO
    return items.map((item: FeedItemDTO) => ({
      id: item.id,
      platform: item.platform,
      title: item.title,
      author: item.author,
      content: item.content,
      originalUrl: item.originalUrl,
      stats: item.stats,
      postedAt: item.postedAt,
    }));
  }
} 