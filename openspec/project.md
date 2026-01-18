# Project Context

## Purpose
Hotop 是一个展示中国社交媒体平台热门话题的 Web 应用。项目目标是：
- 实时展示微博和知乎的热搜数据
- 提供简洁、响应式的界面展示热门话题
- 使用第三方 API 获取实时数据，无需维护爬虫
- 支持深色模式，提供良好的用户体验

## Tech Stack

### 前端框架
- **Astro 5.x**: 主框架，启用 SSR（服务端渲染）
- **Tailwind CSS 4.x**: 样式框架，支持深色模式
- **astro-icon**: 图标库，使用 @iconify/json (ant-design 图标集)

### 部署平台
- **Cloudflare Pages**: 生产环境部署（通过 @astrojs/cloudflare adapter）

### 数据来源
- **第三方 API**:
  - 微博热搜 API: `https://60s.viki.moe/v2/weibo`
  - 知乎热榜 API: `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`

### 包管理
- **pnpm**: 包管理器

## Project Conventions

### Code Style
- **文件命名**: 使用小写字母和连字符（kebab-case）
- **组件**: Astro 组件使用 PascalCase（如 Layout.astro）
- **样式**: 使用 Tailwind CSS 实用类，支持响应式和深色模式
- **SSR 配置**: 页面默认使用 `prerender: false` 启用服务端渲染

### Architecture Patterns

#### 数据流架构
1. **数据来源**: 第三方 API
   - 微博: `https://60s.viki.moe/v2/weibo` (开源项目: https://github.com/vikiboss/60s)
   - 知乎: `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`

2. **展示层**: Astro SSR 页面
   - 服务端实时获取 API 数据
   - 直接渲染展示，无缓存或降级策略

#### 组件结构
- **Layout.astro**: 主布局，包含固定头部和底部导航
- **页面组件**: index.astro（微博）、zhihu.astro（知乎）
- **导航**: 在微博和知乎页面之间切换

### Testing Strategy
- **API 可用性**: 依赖第三方 API 的稳定性，无降级策略
- **手动测试**: 主要通过本地开发环境和预览构建进行测试
- **生产验证**: 通过实际访问验证页面是否正常显示

### Git Workflow

#### 分支策略
- **master 分支**:
  - 用于 Cloudflare Pages 部署
  - 生产环境代码

#### 提交规范
- 代码变更手动提交
- 提交信息应清晰描述变更内容

## Domain Context

### 中国社交媒体平台
- **微博（Weibo）**: 中国最大的社交媒体平台之一，类似 Twitter
- **知乎（Zhihu）**: 中国的问答社区平台，类似 Quora

### 热搜数据特点
- **实时性**: 热搜话题变化快，通过第三方 API 实时获取
- **数据来源**: 使用第三方 API，数据已经过滤处理

### API 数据格式

**微博 API** (`https://60s.viki.moe/v2/weibo`):
```json
{
  "code": 200,
  "message": "获取成功...",
  "data": [
    {
      "title": "话题标题",
      "hot_value": 0,
      "link": "微博搜索链接"
    }
  ]
}
```

**知乎 API** (`https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`):
- 返回热榜问题列表
- 包含标题和摘要信息

## Important Constraints

### 技术限制
- **第三方 API 依赖**: 完全依赖第三方 API 的可用性和稳定性
- **API 限制**: 第三方 API 可能有访问频率限制或服务中断

### 部署限制
- **Cloudflare 配置**:
  - 生产环境禁用 dev toolbar
  - 禁用 platform proxy
  - 必须使用 SSR 模式

## External Dependencies

### 外部 API
- **微博热搜 API**:
  - 来源: `https://60s.viki.moe/v2/weibo`
  - 开源项目: https://github.com/vikiboss/60s
  - 提供实时微博热搜数据
  - 数据已过滤广告和置顶内容

- **知乎热榜 API**:
  - 来源: `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`
  - 知乎官方 API
  - 提供热榜问题列表

### 外部服务
- **GitHub**:
  - 代码托管

- **Cloudflare Pages**:
  - 生产环境托管
  - 全球 CDN 加速
  - 自动部署（从 master 分支）

### CDN 资源
- **@iconify/json**: 图标资源
- **Tailwind CSS**: 样式框架
