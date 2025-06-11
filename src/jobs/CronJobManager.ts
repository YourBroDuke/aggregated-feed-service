import cron from 'node-cron';
import { ProfileUpdateJob } from './ProfileUpdateJob.js';
import { FeedSyncJob } from './FeedSyncJob.js';

export class CronJobManager {
  private profileUpdateJob: ProfileUpdateJob;
  private feedSyncJob: FeedSyncJob;

  constructor(profileUpdateJob: ProfileUpdateJob, feedSyncJob: FeedSyncJob) {
    this.profileUpdateJob = profileUpdateJob;
    this.feedSyncJob = feedSyncJob;
  }

  start(): void {
    // Run profile update job every hour
    cron.schedule('0 * * * *', async () => {
      try {
        await this.profileUpdateJob.run();
      } catch (error) {
        console.error('Profile update job failed:', error);
      }
    });

    // Run feed sync job every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      try {
        await this.feedSyncJob.run();
      } catch (error) {
        console.error('Feed sync job failed:', error);
      }
    });

    console.log('Cron jobs started');
  }
} 