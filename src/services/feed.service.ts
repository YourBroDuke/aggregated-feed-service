import { IFeedItemDal } from '../dal/IFeedItemDal.js';
import { FeedItemDTO } from '../dto/FeedItemDTO.js';

export class FeedService {
  private feedItemDal: IFeedItemDal;

  constructor(feedItemDal: IFeedItemDal) {
    this.feedItemDal = feedItemDal;
  }

  async getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]> {
    const items = await this.feedItemDal.getFeedItems({
      platforms: params.platforms,
      timeRange: params.timeRange,
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
      postedAt: item.postedAt,
    }));
  }
} 