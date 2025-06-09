export interface FeedItemDTO {
  id: string;
  platform: string;
  title: string;
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  content: string;
  postedAt: Date;
  originalUrl: string;
  stats: {
    likes: number;
    comments: number;
    shares: number;
  };
} 