import fp from 'fastify-plugin';
import { FastifyInstance } from 'fastify';
import { MongoClient } from 'mongodb';

async function mongoConnector(fastify: FastifyInstance, options: any) {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI not set');
  const client = new MongoClient(uri, { useUnifiedTopology: true } as any);
  await client.connect();
  fastify.decorate('mongo', client.db());
  fastify.addHook('onClose', async () => {
    await client.close();
  });
}

export default fp(mongoConnector); 