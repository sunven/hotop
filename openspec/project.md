# Project Context

## Purpose
Hotop 是一个展示中国社交媒体平台热门话题的 Web 应用。项目目标是：
- 自动抓取微博和知乎的热搜数据
- 提供简洁、响应式的界面展示热门话题
- 通过 GitHub Actions 实现数据的自动化更新（每 30 分钟）
- 支持深色模式，提供良好的用户体验

## Tech Stack

### 前端框架
- **Astro 5.x**: 主框架，启用 SSR（服务端渲染）
- **Tailwind CSS 4.x**: 样式框架，支持深色模式
- **astro-icon**: 图标库，使用 @iconify/json (ant-design 图标集)

### 部署平台
- **Cloudflare Pages**: 生产环境部署（通过 @astrojs/cloudflare adapter）

### 数据处理
- **Node.js**: 运行数据爬虫
- **cheerio**: HTML 解析
- **date-fns**: 日期处理（配合 @date-fns/tz 处理时区）

### 自动化
- **GitHub Actions**: 定时任务（每 30 分钟运行爬虫）
- **pnpm**: 包管理器

## Project Conventions

### Code Style
- **文件命名**: 使用小写字母和连字符（kebab-case）
- **组件**: Astro 组件使用 PascalCase（如 Layout.astro）
- **样式**: 使用 Tailwind CSS 实用类，支持响应式和深色模式
- **时区处理**: 所有日期操作统一使用上海时区（Asia/Shanghai）
- **SSR 配置**: 页面默认使用 `prerender: false` 启用服务端渲染

### Architecture Patterns

#### 数据流架构
1. **数据采集层**: `index.js` 爬虫脚本
   - 从微博移动端 API 获取热搜数据
   - 过滤广告和置顶内容
   - 保存为 JSON 文件到 `api/` 目录（按日期命名）

2. **数据存储层**: GitHub 仓库
   - JSON 文件提交到 `dev` 分支
   - 通过 GitHub Actions 自动化更新

3. **展示层**: Astro SSR 页面
   - 从 GitHub raw URLs 获取数据
   - 服务端渲染，提供降级策略（回退到昨天数据）

#### 组件结构
- **Layout.astro**: 主布局，包含固定头部和底部导航
- **页面组件**: index.astro（微博）、zhihu.astro（知乎）
- **导航**: 在微博和知乎页面之间切换

### Testing Strategy
- **爬虫可靠性**: index.js 包含重试逻辑（最多 5 次尝试）
- **数据降级**: 前端在获取今日数据失败时自动回退到昨天的数据
- **手动测试**: 主要通过本地开发环境和预览构建进行测试
- **生产验证**: 通过 GitHub Actions 定时任务验证数据采集是否正常

### Git Workflow

#### 分支策略
- **dev 分支**:
  - 用于 GitHub Actions 定时任务触发
  - 存储数据文件（api/ 目录下的 JSON 文件）
  - GitHub Actions 自动提交数据更新

- **master 分支**:
  - 用于 Cloudflare Pages 部署
  - 生产环境代码

**重要**: GitHub Actions 的 schedule 触发器只在默认分支上工作，因此工作流会显式检出 `dev` 分支。

#### 提交规范
- 数据更新由 GitHub Actions 自动提交
- 代码变更手动提交到相应分支
- 提交信息应清晰描述变更内容

## Domain Context

### 中国社交媒体平台
- **微博（Weibo）**: 中国最大的社交媒体平台之一，类似 Twitter
- **知乎（Zhihu）**: 中国的问答社区平台，类似 Quora

### 热搜数据特点
- **实时性**: 热搜话题变化快，需要频繁更新（每 30 分钟）
- **广告过滤**: 微博热搜中包含广告和置顶内容，需要过滤
- **时区**: 所有时间处理使用中国标准时间（Asia/Shanghai）

### 数据格式
- JSON 文件按日期命名（YYYY-MM-DD.json）
- 存储在 `api/` 目录
- 包含热搜话题、热度值等信息

## Important Constraints

### 技术限制
- **Cookie 过期**: 微博 API 需要认证 Cookie（在 index.js:18），Cookie 可能过期需要定期更新
- **API 限制**: 微博移动端 API 可能有访问频率限制
- **GitHub Actions**: schedule 触发器只在默认分支工作

### 部署限制
- **Cloudflare 配置**:
  - 生产环境禁用 dev toolbar
  - 禁用 platform proxy
  - 必须使用 SSR 模式

### 数据限制
- **存储方式**: 数据文件直接提交到 Git 仓库，不适合大规模数据
- **时区依赖**: 所有日期计算必须使用上海时区，避免时区混乱

## External Dependencies

### 外部 API
- **微博移动端 API**:
  - 用于获取热搜数据
  - 需要认证 Cookie
  - API 端点可能变化，需要关注

- **知乎 API**:
  - 用于获取知乎热榜数据
  - 具体实现待补充

### 外部服务
- **GitHub**:
  - 代码托管
  - GitHub Actions 自动化
  - 数据存储（通过 Git 仓库）
  - 数据分发（通过 GitHub raw URLs）

- **Cloudflare Pages**:
  - 生产环境托管
  - 全球 CDN 加速
  - 自动部署（从 master 分支）

### CDN 资源
- **@iconify/json**: 图标资源
- **Tailwind CSS**: 样式框架
