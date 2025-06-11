import { CrawlerService } from './CrawlerService.js';
import { FollowedUser } from '../models/FollowedUser.js';
import { FeedItem } from '../models/FeedItem.js';
import mongoose from 'mongoose';
export class SyncService {
  constructor(private crawlerService: CrawlerService) {}

  async syncUserProfile(userId: mongoose.Types.ObjectId): Promise<void> {
    const user = await FollowedUser.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const crawler = this.crawlerService.getCrawler(user.platform);
    const profile = await crawler.fetchUserProfile(user.profileUrl);

    user.name = profile.name;
    user.avatar = profile.avatar;
    user.lastSyncAt = new Date();
    user.syncStatus = 'success';

    await user.save();
  }

  async syncUserFeeds(userId: mongoose.Types.ObjectId): Promise<void> {
    const user = await FollowedUser.findById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    const crawler = this.crawlerService.getCrawler(user.platform);
    const posts = await crawler.fetchLatestPosts(user.profileUrl, user.lastSyncAt || new Date(0));

    for (const post of posts) {
      await FeedItem.findOneAndUpdate(
        { businessId: post.businessId },
        {
          ...post,
          userId: user._id,
          platform: user.platform
        },
        { upsert: true, new: true }
      );
    }

    user.lastSyncAt = new Date();
    await user.save();
  }

  async syncAllUserProfiles(): Promise<void> {
    const users = await FollowedUser.find({ name: { $exists: false } });
    for (const user of users) {
      try {
        await this.syncUserProfile(user._id);
      } catch (error) {
        console.error(`Failed to sync profile for user ${user._id}:`, error);
        user.syncStatus = 'failed';
        await user.save();
      }
    }
  }

  async syncAllUserFeeds(): Promise<void> {
    const users = await FollowedUser.find();
    for (const user of users) {
      try {
        await this.syncUserFeeds(user._id);
      } catch (error) {
        console.error(`Failed to sync feeds for user ${user._id}:`, error);
        user.syncStatus = 'failed';
        await user.save();
      }
    }
  }
} 