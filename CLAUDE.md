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

- A data scraper (`index.js`) that fetches Weibo hot searches and saves them as JSON files
- An Astro-based web frontend that displays the trending data
- GitHub Actions automation that runs the scraper every 30 minutes

## Key Commands

### Development

```bash
pnpm install          # Install dependencies
pnpm dev              # Start Astro dev server
pnpm build            # Build for production
pnpm preview          # Preview production build
```

### Data Collection

```bash
pnpm start            # Run the Weibo scraper (index.js)
```

This fetches current Weibo trending topics and saves them to `api/YYYY-MM-DD.json`.

## Architecture

### Data Flow

1. **Scraper (index.js)**: Fetches Weibo trending data from their mobile API, filters out ads and pinned posts, and saves to `api/` directory as daily JSON files
2. **GitHub Actions**: Runs scraper every 30 minutes on the `dev` branch, commits new data automatically
3. **Frontend**: Astro pages fetch data from GitHub raw URLs and display trending topics

### Branch Strategy

- `dev`: Used for GitHub Actions schedule triggers and data storage
- `master`: Used for Cloudflare deployment

**Important**: GitHub Actions schedule triggers only work on the default branch, so the workflow checks out `dev` explicitly.

### Key Files

**index.js** (Root-level scraper)

- Fetches from Weibo mobile API with authentication cookies
- Filters out ads and pinned content
- Saves to `api/YYYY-MM-DD.json` using Shanghai timezone
- Has retry logic (5 attempts)
- Cookie in headers may need periodic updates

**src/pages/index.astro** (Weibo trending page)

- Server-side rendered (`prerender: false`)
- Fetches data from GitHub raw URLs
- Falls back to yesterday's data if today's is unavailable
- Uses Shanghai timezone for date calculations

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
- **Date handling**: date-fns with timezone support (@date-fns/tz)
- **Scraping**: cheerio for HTML parsing
- **Package manager**: pnpm

## Important Notes

### Cookie Management

The Weibo API requires authentication cookies in `index.js:18`. These cookies may expire and need to be updated periodically. If the scraper fails, check and update the `Cookie` header.

### Data Storage

- JSON files in `api/` directory are committed to git
- Files are named by date in Shanghai timezone (YYYY-MM-DD.json)
- Frontend fetches from GitHub raw URLs on the `dev` branch

### Deployment

- Astro is configured for Cloudflare with SSR enabled
- Dev toolbar is disabled in production
- Platform proxy is disabled in Cloudflare adapter config
