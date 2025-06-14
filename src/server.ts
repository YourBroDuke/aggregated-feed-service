import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import platformsRoutes from './routes/platform.routes.js';
import feedRoutes from './routes/feed.routes.js';
import followedUsersRoutes from './routes/user.routes.js';
import { connectDB, disconnectDB, initPlatforms } from './utils/db.js';
import { CrawlerService } from './services/CrawlerService.js';
import { SyncService } from './services/SyncService.js';
import { ProfileUpdateJob } from './jobs/ProfileUpdateJob.js';
import { FeedSyncJob } from './jobs/FeedSyncJob.js';
import { CronJobManager } from './jobs/CronJobManager.js';
import { XiaohongshuCrawler } from './crawlers/xiaohongshu/xiaohongshu-crawler.js';

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(fastifyCors);

// Routes
fastify.register(platformsRoutes);
fastify.register(feedRoutes);
fastify.register(followedUsersRoutes);

const start = async () => {
  try {
    await connectDB();
    await initPlatforms();

    // Initialize services
    const crawlerService = CrawlerService.getInstance();
    crawlerService.registerCrawler('xiaohongshu', new XiaohongshuCrawler("abRequestId=12d67c77-c3b0-54dc-97dc-0ce87e04e92d; xsecappid=xhs-pc-web; a1=19555e764479hwh9d88g4uaklbsgdi4czahehdgk850000332233; webId=6f055f2110f421c2f0bd88d132f2daa9; gid=yj222dWKfju2yj222dWK40fk4WjxExjfYYk4xTY70T1DMd28kf34Sx888qqJJqq8W00W4qY0; webBuild=4.68.0; web_session=040069755df46f293e8766d57c3a4b2f7692f6; unread={%22ub%22:%2268483799000000002101a774%22%2C%22ue%22:%2268444c47000000002100eaac%22%2C%22uc%22:17}; acw_tc=0a0b125417498315983692304eae1d8533dcded71804a626556c6e77cdcedd; loadts=1749832481972; websectiga=29098a4cf41f76ee3f8db19051aaa60c0fc7c5e305572fec762da32d457d76ae; sec_poison_id=8a85fce5-32e0-4eb4-89de-3e24574b75e0"));
    const syncService = new SyncService(crawlerService);

    // Initialize jobs
    const profileUpdateJob = new ProfileUpdateJob(syncService);
    const feedSyncJob = new FeedSyncJob(syncService);

    // Initialize and start cron job manager
    const cronJobManager = new CronJobManager(profileUpdateJob, feedSyncJob);
    cronJobManager.start();

    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

start(); 