# 聚合信息流后端 API (Fastify + MongoDB)

## 简介
本项目为多平台内容聚合与关注管理的后端API，基于 Fastify 框架和 MongoDB 数据库实现。API 仅提供数据读取与关注用户管理，数据写入/更新由外部进程负责。

## 主要技术
- Fastify (Node.js Web 框架)
- MongoDB (单一数据源)

## 环境配置
1. 安装依赖：
   ```bash
   npm install
   ```
2. 配置 MongoDB 连接：
   - 复制 `.env` 文件，设置 `MONGODB_URI` 为你的 MongoDB 实例地址。

## 启动服务
```bash
npm run dev
```

## API 说明
详见 [API_SPEC.md](./API_SPEC.md)

## 说明
- 本项目不包含数据采集/写入逻辑，仅提供 API 查询与关注用户管理。
- 单用户模式，无需登录认证。 