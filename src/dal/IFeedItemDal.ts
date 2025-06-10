import { FeedItemDTO } from '../dto/FeedItemDTO.js';

export interface IFeedItemDal {
  getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]>;
} 