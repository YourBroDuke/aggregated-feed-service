import { FeedItemDAO } from './FeedItemDAO.js';
import prisma from '../utils/prisma.js';
import { FeedItemDTO } from '../dto/FeedItemDTO.js';
import { Prisma } from '@prisma/client';

export class FeedItemDAOImpl implements FeedItemDAO {
  async getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    sortBy?: 'newest' | 'popular' | 'engagement';
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]> {
    const {
      platforms,
      timeRange,
      sortBy = 'newest',
      page = 1,
      pageSize = 20,
    } = params;

    const where: Prisma.FeedItemWhereInput = {};
    if (platforms && platforms.length > 0) where.platform = { in: platforms };
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let from: Date | undefined;
      if (timeRange === 'today') {
        from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      } else if (timeRange === 'week') {
        from = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      } else if (timeRange === 'month') {
        from = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }
      if (from) where.postedAt = { gte: from };
    }

    // 只支持按时间排序
    const orderBy: Prisma.FeedItemOrderByWithRelationInput | undefined =
      sortBy === 'newest' ? { postedAt: 'desc' } : undefined;

    const items = await prisma.feedItem.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return items.map(i => ({
      id: i.id,
      platform: i.platform,
      title: i.title || '',
      author: {
        name: (i.author as any)?.name || '',
        avatar: (i.author as any)?.avatar || '',
        username: (i.author as any)?.username || '',
      },
      content: i.content,
      originalUrl: i.originalUrl,
      stats: {
        likes: (i.stats as any)?.likes || 0,
        comments: (i.stats as any)?.comments || 0,
        shares: (i.stats as any)?.shares || 0,
      },
      postedAt: i.postedAt,
    }));
  }
} 