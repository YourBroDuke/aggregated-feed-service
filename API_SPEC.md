# 聚合信息流后端 API 设计文档

## 概述
本API用于支撑一个多平台内容聚合与用户关注管理的前端应用，支持知乎、小红书、哔哩哔哩、Twitter、YouTube五大平台。API需提供内容聚合、平台信息、关注用户管理、筛选与搜索等能力。

---

## 1. 平台信息
### 获取支持平台列表
- **GET** `/api/platforms`
- **返回示例**：
```json
[
  {
    "id": "zhihu",
    "name": "知乎",
    "icon": "/images/zhihu-icon.png",
    "color": "#0084ff",
    "backgroundColor": "#e6f4ff",
    "domain": "zhihu.com"
  },
  ...
]
```

---

## 2. 聚合内容流
### 获取聚合内容流
- **GET** `/api/feed`
- **Query参数**：
  - `platforms` (可选, 多值) 例：`platforms=zhihu,bilibili`
  - `contentTypes` (可选, 多值) 例：`contentTypes=article,video`
  - `timeRange` (可选) `all|today|week|month`
  - `sortBy` (可选) `newest|popular|engagement`
  - `query` (可选) 关键词搜索
  - `inContent` (可选, bool) 是否在内容/摘要中搜索
  - `inAuthor` (可选, bool) 是否在作者中搜索
  - `inTags` (可选, bool) 是否在标签中搜索
- **返回示例**：
```json
[
  {
    "id": "1",
    "platform": "zhihu",
    "author": {
      "name": "技术探索者",
      "avatar": "/images/avatar-placeholder.jpg",
      "username": "tech_explorer"
    },
    "content": "...",
    "summary": "...",
    "timestamp": "2025-06-08T16:45:00Z",
    "originalUrl": "https://zhihu.com/question/12345678",
    "tags": ["前端开发", "技术架构"],
    "stats": { "likes": 1256, "comments": 89, "shares": 45 }
  },
  ...
]
```

---

## 3. 关注用户管理
### 获取关注用户列表
- **GET** `/api/followed-users`
- **返回示例**：
```json
[
  {
    "id": "1",
    "platform": "zhihu",
    "username": "tech_explorer",
    "name": "技术探索者",
    "avatar": "/images/avatar-placeholder.jpg",
    "description": "专注前端技术分享，10年开发经验",
    "profileUrl": "https://zhihu.com/people/tech_explorer",
    "followedAt": "2025-05-15T10:30:00Z",
    "isActive": true
  },
  ...
]
```

### 添加关注用户
- **POST** `/api/followed-users`
- **Body参数**：
  - `profileUrl` (string) 用户主页链接
- **返回**：新关注的用户对象（同上）

### 取消关注用户
- **DELETE** `/api/followed-users/{userId}`
- **返回**：
```json
{ "success": true }
```

---

## 4. 数据结构说明
### Platform
- id, name, icon, color, backgroundColor, domain
### FeedItem
- id, platform, author, content, summary, timestamp, originalUrl, type, tags, stats
### FollowedUser
- id, platform, username, name, avatar, description, profileUrl, followedAt, isActive

---

## 5. 其他说明
- 所有时间均为ISO 8601字符串
- 支持分页可选（如需可扩展参数：`page`, `pageSize`）
- 错误返回格式：
```json
{ "error": "错误描述" }
``` 