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
    const crawlerService = new CrawlerService();
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