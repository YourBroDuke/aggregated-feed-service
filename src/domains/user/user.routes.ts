import { FastifyInstance } from 'fastify';
import { FollowedUserDAOImpl } from '../../dao/FollowedUserDAOImpl';

export default async function routes(fastify: FastifyInstance, options: any) {
  const followedUserDAO = new FollowedUserDAOImpl();

  // 获取关注用户列表
  fastify.get('/api/followed-users', async (request, reply) => {
    const followedUsers = await followedUserDAO.getFollowedUsers();
    return followedUsers;
  });

  // 添加关注用户
  fastify.post('/api/followed-users', async (request, reply) => {
    const { profileUrl } = request.body as { profileUrl: string };
    if (!profileUrl) return reply.code(400).send({ error: 'profileUrl required' });
    const followedUser = await followedUserDAO.addFollowedUser(profileUrl);
    return followedUser;
  });

  // 取消关注用户
  fastify.delete('/api/followed-users/:userId', async (request, reply) => {
    const { userId } = request.params as { userId: string };
    const result = await followedUserDAO.removeFollowedUser(userId);
    return result;
  });
} 