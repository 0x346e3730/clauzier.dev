# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal website/blog built with Astro, featuring a cyberpunk/hacker aesthetic with a dark terminal theme. The site generates static pages and is deployed with Caddy.

## Commands

### Development
- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build

### Package Management
- `bun install` - Install dependencies
- Uses Bun as the package manager (bun.lock present)

### Docker
- `docker build .` - Build Docker image
- Uses multi-stage build with Caddy for serving static files

## Architecture

### Framework & Technologies
- **Astro 5.11.0** - Static site generator with islands architecture
- **Tailwind CSS 4.x** - Utility-first CSS framework with custom hacker theme
- **MDX** - Markdown with JSX for blog content
- **TypeScript** - Strict TypeScript configuration

### Content Management
- **Content Collections** - Blog posts stored in `src/content/blog/`
- **Zod Schema** - Type-safe content validation in `src/content/config.ts`
- **RSS Feed** - Generated at `/rss.xml` via `src/pages/rss.xml.js`

### Styling & Theme
- **Cyberpunk Theme** - Custom hacker-style colors, animations, and effects
- **Monaspace Fonts** - Multiple variants (Neon, Radon, Argon) for different text types
- **Custom Animations** - Matrix rain, scan lines, terminal cursor, glitch effects
- **Responsive Design** - Mobile-first approach with print styles

### Key Components
- `src/layouts/Layout.astro` - Main layout with SEO meta tags and analytics
- `src/components/Navigation.astro` - Site navigation
- `src/components/Footer.astro` - Site footer
- `src/pages/index.astro` - Homepage
- `src/pages/blog.astro` - Blog listing
- `src/pages/resume.astro` - Resume page

### Analytics & SEO
- **Plausible Analytics** - Privacy-focused analytics at plausible.clauzier.dev
- **Comprehensive SEO** - Open Graph, Twitter Cards, structured data
- **Sitemap** - Auto-generated sitemap support

### Deployment
- **Static Output** - Configured for static site generation
- **Caddy Server** - Serves static files in production
- **Docker** - Multi-stage build for production deployment

## Development Guidelines

### File Organization
- Components in `src/components/`
- Pages in `src/pages/`
- Layouts in `src/layouts/`
- Content in `src/content/`
- Types in `src/types/`
- Utilities in `src/utils/`

### Styling Conventions
- Use Tailwind classes with custom hacker theme colors
- Follow existing animation and effect patterns
- Maintain cyberpunk aesthetic consistency
- Use appropriate Monaspace font variants for different content types

### Content Creation
- Blog posts use MDX format with frontmatter
- Follow schema defined in `src/content/config.ts`
- Support for tags, external links, and draft status