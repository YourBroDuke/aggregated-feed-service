# 聚合信息流后端 API (Fastify + MongoDB)

## 简介
本项目为多平台内容聚合与关注管理的后端API，基于 Fastify 框架和 MongoDB 数据库实现。API 仅提供数据读取与关注用户管理，数据写入/更新由外部进程负责。

## 主要技术
- Fastify (Node.js Web 框架)
- MongoDB (单一数据源)

## 环境配置与启动指南
 rque

 
### 1. 克隆项目

```bash
git clone <你的仓库地址>
cd aggregated-feed-service
```

### 2. 安装依赖

请确保你已安装 [pnpm](https://pnpm.io/zh/installation) 和 Node.js (建议版本 18+)。

```bash
pnpm install --reporter=default
```

### 3. 配置环境变量

1. 复制 `.env.example` 文件为 `.env`（如无 `.env.example`，请直接新建 `.env` 文件）：
   ```bash
   cp .env.example .env
   ```
2. 编辑 `.env` 文件，设置你的 MongoDB 连接字符串，例如：
   ```
   DATABSE_URL=mongodb://localhost:27017/aggregated-feed
   ```

### 4. 启动开发服务器

```bash
pnpm run dev
```

服务器启动后，默认监听端口请参考 `.env` 或 `src/config` 配置。

## API 说明
详见 [API_SPEC.md](./API_SPEC.md)

## 说明
- 本项目不包含数据采集/写入逻辑，仅提供 API 查询与关注用户管理。
- 单用户模式，无需登录认证。 