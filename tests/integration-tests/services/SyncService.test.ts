import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../../../src/utils/db.js';
import { SyncService } from '../../../src/services/SyncService.js';
import { CrawlerService } from '../../../src/services/CrawlerService.js';
import { FollowedUser } from '../../../src/models/FollowedUser.js';
import { XiaohongshuCrawler } from '../../../src/crawlers/xiaohongshu/xiaohongshu-crawler.js';
import { FeedItem, IFeedItem } from '../../../src/models/FeedItem.js';

describe('SyncService Integration Tests', () => {
  let syncService: SyncService;
  let testUserId: mongoose.Types.ObjectId;

  beforeAll(async () => {
    await connectDB();
    const xiaohongshuCrawler = new XiaohongshuCrawler('abRequestId=12d67c77-c3b0-54dc-97dc-0ce87e04e92d; xsecappid=xhs-pc-web; a1=19555e764479hwh9d88g4uaklbsgdi4czahehdgk850000332233; webId=6f055f2110f421c2f0bd88d132f2daa9; gid=yj222dWKfju2yj222dWK40fk4WjxExjfYYk4xTY70T1DMd28kf34Sx888qqJJqq8W00W4qY0; webBuild=4.68.0; web_session=040069755df46f293e8766d57c3a4b2f7692f6; acw_tc=0ad5847f17499798671356733e7db91e4c4cb0b54f448b606ecdc2934e7fe1; websectiga=634d3ad75ffb42a2ade2c5e1705a73c845837578aeb31ba0e442d75c648da36a; sec_poison_id=8d5c59fc-bce3-46b1-aeae-cdfa47a0e35d; unread={%22ub%22:%22684d8b9900000000210059d1%22%2C%22ue%22:%22684c14a2000000002001f570%22%2C%22uc%22:19}; loadts=1749979877870');
    const crawlerService = CrawlerService.getInstance();
    crawlerService.registerCrawler('xiaohongshu', xiaohongshuCrawler);
    syncService = new SyncService(crawlerService);

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
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      await FollowedUser.findByIdAndDelete(testUserId);
      await FeedItem.deleteMany({ 'author.userId': testUserId });
    }
    await disconnectDB();
  });

  it('should sync user profile successfully', async () => {
    // Sync the user profile
    await syncService.syncUserProfile(testUserId);

    // Verify the user profile was updated
    const updatedUser = await FollowedUser.findById(testUserId);
    console.log('Updated user:', updatedUser);
    expect(updatedUser?.name).toBeDefined();
    expect(updatedUser?.username).toBeDefined();
    expect(updatedUser?.avatar).toBeDefined();
    expect(updatedUser?.syncStatus).toBeUndefined();
    expect(updatedUser?.syncCursor).toBeUndefined();
  }, 60000);

  it('should sync user feeds successfully', async () => {
    // Sync the user feeds
    await syncService.syncUserFeeds(testUserId);

    // Verify that feed items were created
    const feedItems = await FeedItem.find({ 'author.userId': testUserId });
    expect(feedItems.length).toBeGreaterThan(0);

    // Verify all the fields of feed items
    feedItems.forEach((feedItem) => {
      expect(feedItem.businessId).toBeDefined();
      expect(feedItem.platform).toBe('xiaohongshu');
      expect(feedItem.author.userId.toString()).toEqual(testUserId.toString());
      expect(feedItem.author.name).toBeDefined();
      expect(feedItem.author.avatar).toBeDefined();
      expect(feedItem.author.username).toBeDefined();
      expect(feedItem.title).toBeDefined();
      expect(feedItem.content).toBeDefined();
      expect(feedItem.originalUrl).toContain('xiaohongshu.com');
      expect(feedItem.originalUrl).toContain('https://www.xiaohongshu.com/');
      expect(feedItem.postedAt).toBeDefined();
    });
  }, 60000);
});
