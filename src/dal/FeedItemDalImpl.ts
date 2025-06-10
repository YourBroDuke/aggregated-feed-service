import { IFeedItemDal } from './IFeedItemDal.js';
import prisma from '../utils/prisma.js';
import { FeedItemDTO } from '../dto/FeedItemDTO.js';
import { Prisma } from '@prisma/client';

export class FeedItemDalImpl implements IFeedItemDal {
  async getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]> {
    const {
      platforms,
      timeRange,
      page = 1,
      pageSize = 20,
    } = params;

    const where: Prisma.FeedItemsWhereInput = {};
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
    const orderBy: Prisma.FeedItemsOrderByWithRelationInput | undefined =
      { postedAt: 'desc' };

    const items = await prisma.feedItems.findMany({
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
      postedAt: i.postedAt,
    }));
  }
}