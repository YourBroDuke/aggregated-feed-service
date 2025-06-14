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
    const xiaohongshuCrawler = new XiaohongshuCrawler('abRequestId=12d67c77-c3b0-54dc-97dc-0ce87e04e92d; xsecappid=xhs-pc-web; a1=19555e764479hwh9d88g4uaklbsgdi4czahehdgk850000332233; webId=6f055f2110f421c2f0bd88d132f2daa9; gid=yj222dWKfju2yj222dWK40fk4WjxExjfYYk4xTY70T1DMd28kf34Sx888qqJJqq8W00W4qY0; webBuild=4.68.0; web_session=040069755df46f293e8766d57c3a4b2f7692f6; websectiga=8886be45f388a1ee7bf611a69f3e174cae48f1ea02c0f8ec3256031b8be9c7ee; acw_tc=0a4a3c6d17498297953154975e56196827e92a0cffe10dee7090fe1639b2b9; sec_poison_id=c68792e5-fbf6-4778-b0b9-ed68de489d00; loadts=1749830406010; unread={%22ub%22:%2268483799000000002101a774%22%2C%22ue%22:%2268444c47000000002100eaac%22%2C%22uc%22:17}');
    const crawlerService = CrawlerService.getInstance();
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
    console.log('Updated user:', updatedUser);
    expect(updatedUser?.name).toBeDefined();
    expect(updatedUser?.username).toBeDefined();
    expect(updatedUser?.avatar).toBeDefined();
    expect(updatedUser?.syncStatus).toBeUndefined();
    expect(updatedUser?.syncCursor).toBeUndefined();
  }, 60000);
});
