# 个人主页 CMS

一个带后台管理系统的个人网站。支持博客、项目、荣誉的增删改查，内置图片上传和 Markdown 编辑。

## 技术栈

- **框架：** Next.js 15（App Router）
- **语言：** TypeScript
- **样式：** Tailwind CSS 4
- **数据库：** SQLite（Prisma ORM）
- **认证：** JWT（jose）+ bcryptjs
- **Markdown：** react-markdown + remark-gfm
- **图标：** lucide-react

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 初始化数据库

```bash
npm run db:push
npm run db:seed
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开 http://localhost:3000 查看网站。

### 4. 登录后台

访问 http://localhost:3000/admin/login

**默认账号：**
- 用户名：`admin`
- 密码：`admin123456`

## 构建部署

```bash
npm run build
npm start
```

## 项目结构

```
src/
  app/
    (front)/          # 前台页面（首页、关于、荣誉、项目、博客、CTF）
    admin/            # 后台管理（仪表盘、个人信息、荣誉、项目、文章）
    api/              # API 接口
  components/
    admin/            # 后台组件（表单、图片上传）
    front/            # 前台组件（导航、页脚）
    markdown/         # Markdown 渲染
  lib/
    auth.ts           # JWT 认证工具
    prisma.ts         # Prisma 客户端单例
prisma/
  schema.prisma       # 数据库模型定义
  seed.ts             # 初始数据
public/
  uploads/            # 上传的图片
```

## 功能说明

### 前台

- **首页：** 个人展示、精选荣誉/项目、最新文章
- **关于：** 个人简介、技术栈
- **荣誉：** 荣誉列表，支持按年份和级别筛选，证书图片点击放大
- **项目：** 项目展示，包含技术栈、亮点、链接
- **博客：** Markdown 文章，适合技术文章和 CTF 题解
- **CTF：** 按分类展示 CTF 题解（Web、Crypto、Misc、Reverse、Pwn）

### 后台

- **仪表盘：** 荣誉/项目/文章数量统计
- **个人信息：** 姓名、头像、简介、技术栈、标签
- **荣誉管理：** 新增/编辑/删除荣誉，设置首页精选
- **项目管理：** 新增/编辑/删除项目，设置首页精选
- **文章管理：** 新增/编辑/删除文章，发布/草稿状态切换

### 图片上传

- 支持格式：JPG、JPEG、PNG、WebP
- 大小限制：5MB
- 存储位置：`public/uploads/`
- 数据库保存路径：`/uploads/filename.ext`

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产版本 |
| `npm start` | 启动生产服务器 |
| `npm run db:push` | 同步数据库结构 |
| `npm run db:seed` | 初始化示例数据 |
| `npm run db:reset` | 重置数据库并重新初始化 |
| `npm run db:studio` | 打开 Prisma Studio |

## 上线前注意事项

1. **修改默认管理员密码** — 登录后立即修改
2. **设置安全的 JWT 密钥** — 在 `.env` 中设置 `JWT_SECRET=你的随机密钥`
3. **配置域名** — 更新硬编码的 URL
4. **启用 HTTPS** — 使用 Nginx 反向代理或部署到 Vercel
5. **检查上传目录** — 确保 `public/uploads/` 中没有敏感内容
