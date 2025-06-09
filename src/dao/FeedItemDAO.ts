import { FeedItemDTO } from '../dto/FeedItemDTO';

export interface FeedItemDAO {
  getFeedItems(params: {
    platforms?: string[];
    timeRange?: 'all' | 'today' | 'week' | 'month';
    sortBy?: 'newest' | 'popular' | 'engagement';
    query?: string;
    inContent?: boolean;
    inAuthor?: boolean;
    inTags?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<FeedItemDTO[]>;
} 