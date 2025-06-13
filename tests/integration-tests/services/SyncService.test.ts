import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../../src/utils/db.js';
import { SyncService } from '../../../src/services/SyncService.js';
import { CrawlerService } from '../../../src/services/CrawlerService.js';
import { FollowedUser } from '../../../src/models/FollowedUser.js';
import { XiaohongshuCrawler } from '../../../src/crawlers/xiaohongshu/xiaohongshu-crawler.js';

describe('SyncService Integration Tests', () => {
  let syncService: SyncService;
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();
    const xiaohongshuCrawler = new XiaohongshuCrawler('test-cookies');
    const crawlerService = new CrawlerService();
    crawlerService.registerCrawler('xiaohongshu', xiaohongshuCrawler);
    syncService = new SyncService(crawlerService);
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      await FollowedUser.findByIdAndDelete(testUserId);
    }
    await disconnectDB();
  });

  it('should sync user profile successfully', async () => {
    // Create a test user
    const testUser = await FollowedUser.create({
      platform: 'xiaohongshu',
      profileUrl: 'https://www.xiaohongshu.com/user/profile/63d610b5000000002702b335',
      followedAt: new Date(),
    });
    testUserId = testUser._id;

    expect(testUser.name).toBeUndefined();
    expect(testUser.username).toBeUndefined();
    expect(testUser.avatar).toBeUndefined();
    expect(testUser.syncStatus).toBeUndefined();
    expect(testUser.syncCursor).toBeUndefined();

    // Sync the user profile
    await syncService.syncUserProfile(testUserId);

    // Verify the user profile was updated
    const updatedUser = await FollowedUser.findById(testUserId);
    expect(updatedUser?.name).toBeDefined();
    expect(updatedUser?.username).toBeDefined();
    expect(updatedUser?.avatar).toBeDefined();
    expect(updatedUser?.syncStatus).toBeUndefined();
    expect(updatedUser?.syncCursor).toBeUndefined();
  });
});
