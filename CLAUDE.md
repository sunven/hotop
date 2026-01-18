<!-- OPENSPEC:START -->
# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.

<!-- OPENSPEC:END -->

# CLAUDE.md

**Always answer me in Chinese.**

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hotop is a web application that displays trending topics from Chinese social media platforms (Weibo and Zhihu). It consists of:

- An Astro-based web frontend that displays the trending data
- Uses third-party APIs to fetch real-time trending data

## Key Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Astro dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

## Architecture

### Data Flow

1. **Third-party APIs**:
   - Weibo: Uses `https://60s.viki.moe/v2/weibo` API (from https://github.com/vikiboss/60s)
   - Zhihu: Uses official Zhihu API `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`
2. **Frontend**: Astro pages fetch data directly from APIs and display trending topics in real-time

### Branch Strategy

- `master`: Used for Cloudflare deployment

### Key Files

**src/pages/index.astro** (Weibo trending page)

- Server-side rendered (`prerender: false`)
- Fetches data from third-party API: `https://60s.viki.moe/v2/weibo`
- Displays hot search topics with optional hot_value

**src/pages/zhihu.astro** (Zhihu trending page)

- Server-side rendered (`prerender: false`)
- Fetches data from Zhihu official API
- Displays trending questions with excerpts

**src/layouts/Layout.astro**

- Main layout with fixed header and footer navigation
- Navigation between Weibo (/) and Zhihu (/zhihu) pages
- Uses astro-icon for icons (ant-design icon set)
- Tailwind CSS for styling with dark mode support

### Technology Stack

- **Framework**: Astro 5.x with SSR
- **Deployment**: Cloudflare Pages (via @astrojs/cloudflare adapter)
- **Styling**: Tailwind CSS 4.x
- **Icons**: astro-icon with @iconify/json
- **Package manager**: pnpm

## Important Notes

### Third-party API Dependencies

- **Weibo API**: `https://60s.viki.moe/v2/weibo` (开源项目: https://github.com/vikiboss/60s)
- **Zhihu API**: `https://www.zhihu.com/api/v3/feed/topstory/hot-lists/total`
- Both APIs are fetched in real-time without caching or fallback strategies

### Deployment

- Astro is configured for Cloudflare with SSR enabled
- Dev toolbar is disabled in production
- Platform proxy is disabled in Cloudflare adapter config
