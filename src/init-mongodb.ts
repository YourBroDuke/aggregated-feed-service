import { MongoClient, ServerApiVersion } from 'mongodb';

async function collectionExists(db: any, name: string): Promise<boolean> {
  const collections = await db.listCollections({ name }).toArray();
  return collections.length > 0;
}

export async function initMongoDB() {
  console.log(process.env.MONGODB_URI);
  const uri = process.env.MONGODB_URI as string;
  if (!uri) {
    throw new Error('请在环境变量中设置MONGODB_URI');
  }
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  console.log("start connect");
  await client.connect();
  console.log("connect success");
  const db = client.db();

  // FeedItem 示例
  if (!(await collectionExists(db, 'FeedItems'))) {
    const feedItems = db.collection('FeedItems');
    await feedItems.createIndex({ id: 1 }, { unique: true });
    await feedItems.insertOne({
      title: '示例动态',
      platform: 'twitter',
      author: {
        name: '张三',
        avatar: 'https://example.com/avatar.png',
        username: 'zhangsan',
      },
      content: '这是一条示例内容',
      originalUrl: 'https://twitter.com/example',
      stats: {
        likes: 10,
        comments: 2,
        shares: 1,
      },
      postedAt: new Date(),
    });
    console.log('已创建 feedItems 集合并插入示例数据');
  } else {
    console.log('feedItems 集合已存在，跳过创建');
  }

  // FollowedUser 示例
  if (!(await collectionExists(db, 'FollowedUsers'))) {
    const followedUsers = db.collection('FollowedUsers');
    await followedUsers.createIndex({ id: 1 }, { unique: true });
    await followedUsers.insertOne({
      platform: 'twitter',
      username: 'zhangsan',
      name: '张三',
      avatar: 'https://example.com/avatar.png',
      description: '前端开发者',
      profileUrl: 'https://twitter.com/zhangsan',
      followedAt: new Date(),
    });
    console.log('已创建 followedUsers 集合并插入示例数据');
  } else {
    console.log('followedUsers 集合已存在，跳过创建');
  }

  // Platform 示例
  if (!(await collectionExists(db, 'Platforms'))) {
    const platforms = db.collection('Platforms');
    await platforms.createIndex({ id: 1 }, { unique: true });
    await platforms.insertOne({
      name: 'Twitter',
      icon: 'twitter-icon',
      color: '#1da1f2',
      backgroundColor: '#ffffff',
      domain: 'twitter.com',
    });
    console.log('已创建 platforms 集合并插入示例数据');
  } else {
    console.log('platforms 集合已存在，跳过创建');
  }

  console.log('MongoDB 初始化完成');
  await client.close();
}
