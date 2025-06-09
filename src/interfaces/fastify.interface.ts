import 'fastify';
import { Db } from 'mongodb';

declare module 'fastify' {
  interface FastifyInstance {
    mongo: Db;
  }
} 