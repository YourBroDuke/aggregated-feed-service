import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import platformsRoutes from './domains/platform/platform.routes';
import feedRoutes from './domains/feed/feed.routes';
import followedUsersRoutes from './domains/user/user.routes';
import { initMongoDB } from './init-mongodb';

const fastify = Fastify({ logger: true });

// Plugins
fastify.register(fastifyCors);

// Routes
fastify.register(platformsRoutes);
fastify.register(feedRoutes);
fastify.register(followedUsersRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

initMongoDB().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});

start(); 