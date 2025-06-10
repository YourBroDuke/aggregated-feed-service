import mongoose, { Document } from 'mongoose';

interface IAuthor {
  name: string;
  avatar: string;
  username: string;
}

interface IFeedItem extends Document {
  title: string;
  platform: string;
  author: IAuthor;
  content: string;
  originalUrl: string;
  postedAt: Date;
}

const feedItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  platform: { type: String, required: true },
  author: {
    name: { type: String, required: true },
    avatar: { type: String, required: true },
    username: { type: String, required: true }
  },
  content: { type: String, required: true },
  originalUrl: { type: String, required: true },
  postedAt: { type: Date, required: true }
}, { timestamps: true });

export const FeedItem = mongoose.model<IFeedItem>('FeedItem', feedItemSchema); 