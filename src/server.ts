import dotenv from 'dotenv';
dotenv.config();
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import platformsRoutes from './routes/platform.routes.js';
import feedRoutes from './routes/feed.routes.js';
import followedUsersRoutes from './routes/user.routes.js';
import { initMongoDB } from './init-mongodb.js';

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

await initMongoDB().catch(err => {
  console.error('初始化失败:', err);
  process.exit(1);
});

start(); 