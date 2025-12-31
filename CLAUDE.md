# CLAUDE.md

This file provides comprehensive guidance to Claude Code when working on this Astro personal website project.

## Project Overview

**clauzier.dev** - A high-performance personal website/portfolio with a cyberpunk/hacker aesthetic. Built with Astro for maximum speed and minimal JavaScript.

### Core Philosophy
- **Performance First**: Static generation, minimal JS, optimized assets
- **Deadly Simple**: No over-engineering, no unnecessary abstractions
- **Fast as Fuck**: Every byte counts, every ms matters
- **Cyberpunk Aesthetic**: Terminal green, matrix vibes, hacker culture

## Quick Commands

### Development
```bash
bun run dev          # Start dev server (default: http://localhost:4321)
bun run build        # Build for production
bun run preview      # Preview production build locally
```

### Quality & Testing
```bash
bun run lint         # Lint TypeScript and Astro files
bun run lint:fix     # Auto-fix linting issues
bun run format       # Format code with Prettier
bun run format:check # Check code formatting
bun run test         # Run tests with Vitest
bun run test:ui      # Run tests with UI
bun run typecheck    # Run Astro type checking
```

### Package Management
- **Package Manager**: Bun (fast, modern)
- **Lock File**: `bun.lock`
- Install deps: `bun install`

### Deployment
```bash
docker build .       # Build production Docker image
docker compose up    # Run with Caddy server
```

## Project Architecture

### Stack
- **Astro 5.16.6** - Static site generator (SSG)
- **Tailwind CSS 4.x** - Utility-first CSS with custom theme
- **TypeScript** - Type-safe development
- **MDX** - Blog content with components
- **Bun** - Fast package manager & runtime

### Output Mode
- **Static Generation**: `output: 'static'` in astro.config.mjs
- No SSR, no server-side rendering
- Pure static HTML/CSS/JS files

### Performance Optimizations
- CSS code splitting enabled
- Terser minification with `console.log` removal
- Manual chunk splitting (vendor, utils)
- Image optimization with Sharp
- Prefetching with hover strategy
- Font preloading
- HTML compression

## File Structure

```
clauzier.dev/
├── src/
│   ├── components/          # Reusable Astro components
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── OptimizedImage.astro
│   │   ├── SEOHead.astro
│   │   └── ...
│   ├── layouts/             # Page layouts
│   │   ├── Layout.astro           # Main layout with SEO
│   │   └── BlogPostLayout.astro   # Blog post template
│   ├── pages/               # Routes (file-based routing)
│   │   ├── index.astro            # Homepage
│   │   ├── blog.astro             # Blog listing
│   │   ├── blog/[...slug].astro   # Dynamic blog posts
│   │   ├── resume.astro           # Resume/CV
│   │   └── rss.xml.js             # RSS feed
│   ├── content/             # Content collections
│   │   ├── config.ts              # Zod schemas
│   │   └── blog/                  # MDX blog posts
│   ├── styles/
│   │   └── global.css             # Global styles, font imports
│   ├── utils/               # TypeScript utilities
│   │   ├── date.ts                # Date formatting
│   │   ├── readingTime.ts         # Calculate reading time
│   │   ├── seo.ts                 # SEO helpers
│   │   ├── imageOptimization.ts   # Image configs
│   │   ├── sanitize.ts            # Input sanitization
│   │   ├── security.ts            # Security utilities
│   │   └── experience.ts          # Work experience utils
│   ├── constants/           # Configuration constants
│   │   ├── site.ts                # Site config
│   │   └── theme.ts               # Theme config
│   ├── types/               # TypeScript type definitions
│   │   ├── blog.ts
│   │   ├── common.ts
│   │   └── experience.ts
│   ├── data/
│   │   └── experiences.ts         # Work experience data
│   ├── assets/              # Images, static assets
│   └── test/                # Test files
├── public/                  # Static files (served as-is)
├── astro.config.mjs         # Astro configuration
├── tailwind.config.mjs      # Tailwind configuration
├── tsconfig.json            # TypeScript config
├── package.json
├── Dockerfile               # Production build
├── compose.yml              # Docker Compose setup
└── CLAUDE.md                # This file
```

## Styling & Theming

### Tailwind Configuration
Custom cyberpunk/hacker theme with:

**Color Palette**:
- `hacker-primary`: #00ff00 (terminal green)
- `hacker-secondary`: #0f0 (bright neon)
- `hacker-dark`: #001100 (dark green bg)
- `hacker-accent`: #ff00ff (cyberpunk magenta)
- `hacker-terminal`: #0C0C0C (terminal black)

**Custom Animations**:
- `terminal-blink` - Cursor blinking
- `scan-line` - CRT scan effect
- `glitch` - Glitch effect
- `matrix` - Matrix rain
- `retrowave` - Retro animation
- `glow` - Glow effect

### Typography
**Monaspace Font Family** (self-hosted via @fontsource):
- **Monaspace Neon** - Body text, headings, general content
- **Monaspace Radon** - Navigation, tags, metadata, terminal prompts
- **Monaspace Argon** - Code blocks

Font features enabled:
- `calt` (contextual alternates)
- `ss01-ss08` (stylistic sets)
- `font-display: swap` for performance

### Styling Conventions
1. **Use Tailwind classes** with custom theme colors
2. **Component-scoped styles** in `<style>` blocks when needed
3. **Global styles** in `src/styles/global.css` (keep minimal)
4. **Inline critical CSS** in Layout.astro for above-the-fold content
5. **Maintain cyberpunk aesthetic** - green terminals, matrix effects, glowing borders

## Content Management

### Blog Posts
- **Location**: `src/content/blog/*.mdx`
- **Format**: MDX (Markdown + JSX components)
- **Schema**: Defined in `src/content/config.ts` with Zod

**Required Frontmatter**:
```yaml
---
title: "Post Title"
pubDate: 2025-12-31
description: "Brief description"  # Optional but recommended
---
```

**Optional Frontmatter**:
- `tags`: Array of strings
- `categories`: Array of strings
- `series`, `seriesOrder`: For multi-part posts
- `heroImage`: { src, alt, caption }
- `draft`: Boolean (default: false)
- `featured`: Boolean (default: false)
- `external`: { url, site } for cross-posted content
- `difficulty`: 'beginner' | 'intermediate' | 'advanced'
- `canonical`: URL for canonical link

### Creating New Blog Posts
1. Create `src/content/blog/slug-name.mdx`
2. Add frontmatter with required fields
3. Write content in MDX
4. Posts are automatically listed on `/blog/`
5. RSS feed auto-updates

### Content Plugins
- `remark-gfm` - GitHub Flavored Markdown
- `rehype-slug` - Auto heading IDs
- `rehype-autolink-headings` - Clickable heading links
- `rehype-pretty-code` - Syntax highlighting (github-dark theme)

## Components Guide

### Key Components

**Layout Components**:
- `Layout.astro` - Main layout with SEO, analytics, meta tags
- `BlogPostLayout.astro` - Blog post template with reading time

**UI Components**:
- `Navigation.astro` - Site navigation header
- `Footer.astro` - Site footer
- `SEOHead.astro` - SEO meta tags, Open Graph, Twitter Cards
- `CriticalResourceHints.astro` - DNS prefetch, preconnect, font preload

**Image Components**:
- `OptimizedImage.astro` - Responsive images with lazy loading
- `ProfilePicture.astro` - Profile photo with optimizations
- `SpoilerImage.astro` - Click-to-reveal images

**Utility Components**:
- `SafeLink.astro` - External links with security (rel="noopener")
- `TerminalPrompt.astro` - Terminal-style prompt element
- `ErrorBoundary.astro` - Error handling wrapper
- `SkipLink.astro` - Accessibility skip-to-content link

### Component Conventions
1. **Props interface** at top of frontmatter
2. **Destructure props** with defaults
3. **TypeScript types** for all props
4. **Accessibility** - ARIA labels, semantic HTML
5. **Performance** - lazy loading, minimal JS

## Development Guidelines

### Code Style
- **TypeScript everywhere** - No JavaScript files in src/
- **Explicit types** - Avoid `any`, prefer interfaces/types
- **Functional style** - Pure functions, immutability preferred
- **Descriptive names** - Clear variable/function names
- **ESLint + Prettier** - Auto-formatting enforced

### Performance Rules
1. **Minimal JavaScript** - Only add JS when absolutely necessary
2. **Static-first** - Default to static HTML/CSS
3. **Lazy loading** - Images, non-critical resources
4. **Code splitting** - Manual chunks in astro.config.mjs
5. **Optimize images** - Use OptimizedImage component, WebP/AVIF
6. **Prefetch wisely** - Only likely navigation targets
7. **Inline critical CSS** - Above-the-fold styles in <head>
8. **Font optimization** - Preload, display: swap

### Adding New Features
1. **Check if it's needed** - Does it serve the user or just look cool?
2. **Measure impact** - Will it slow down the site?
3. **Static > Dynamic** - Can it be pre-rendered?
4. **Component first** - Reusable Astro components
5. **Test performance** - Build and check bundle size

### Common Tasks

**Add a new page**:
1. Create `src/pages/pagename.astro`
2. Use Layout component
3. Add to Navigation if needed

**Add a new component**:
1. Create `src/components/ComponentName.astro`
2. Define Props interface
3. Document usage in this file

**Update site config**:
- Edit `src/constants/site.ts`
- Includes: title, description, author, social links, analytics

**Add a new utility function**:
1. Create/update file in `src/utils/`
2. Export typed functions
3. Add unit tests in `src/test/`

**Modify theme colors/animations**:
- Edit `tailwind.config.mjs`
- Update CSS custom properties if needed

## Analytics & SEO

### Analytics
- **Plausible Analytics** - Privacy-focused, self-hosted at `plausible.clauzier.dev`
- Configured in `src/constants/site.ts`
- Script loaded in Layout.astro

### SEO Configuration
- **SEOHead component** - Generates meta tags, Open Graph, Twitter Cards
- **Sitemap** - Auto-generated at `/sitemap-index.xml`
- **RSS feed** - Available at `/rss.xml`
- **Structured data** - JSON-LD for rich snippets
- **Canonical URLs** - Prevent duplicate content issues

### SEO Best Practices
1. Unique title/description per page
2. Alt text for all images
3. Semantic HTML (h1-h6 hierarchy)
4. Internal linking between posts
5. Mobile-responsive design

## Deployment

### Docker Production Build
```dockerfile
FROM oven/bun:latest as builder
# Build Astro site

FROM caddy:alpine
# Serve static files with Caddy
```

**Build**: `docker build -t clauzier-dev .`
**Run**: `docker compose up -d`

### Caddy Configuration
- Serves static files from `/dist`
- HTTPS with automatic certificates
- Compression (gzip, brotli, zstd)
- Caching headers for static assets

### Environment
- No environment variables needed (static site)
- All config in `src/constants/`

## Testing

### Unit Tests
- **Framework**: Vitest
- **Location**: `src/test/`
- Run: `bun run test`

### Type Checking
- Run: `bun run typecheck`
- Astro's built-in TypeScript checking

### Manual Testing Checklist
- [ ] Build completes without errors
- [ ] All pages render correctly
- [ ] Images load and are optimized
- [ ] Navigation works
- [ ] Blog posts display properly
- [ ] RSS feed validates
- [ ] Lighthouse score > 95 (Performance)

## Common Pitfalls & Solutions

### Issue: Slow build times
**Solution**:
- Optimize images before adding to `/public` or `/src/assets`
- Reduce number of pages being pre-rendered
- Check for circular imports

### Issue: Large bundle size
**Solution**:
- Check `stats.html` (rollup-plugin-visualizer)
- Remove unused dependencies
- Ensure code splitting is working
- Check icon usage (only include needed icons)

### Issue: Runtime errors in production
**Solution**:
- Test with `bun run build && bun run preview`
- Check for client-only code in components
- Verify all imports are resolved

### Issue: Font loading delays (FOIT/FOUT)
**Solution**:
- Fonts are already preloaded in CriticalResourceHints
- Using `font-display: swap`
- If issues persist, inline critical font subset

## Performance Targets

### Lighthouse Scores
- Performance: 95+
- Accessibility: 100
- Best Practices: 95+
- SEO: 100

### Core Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTFB** (Time to First Byte): < 800ms

### Bundle Sizes
- **Total JS**: < 50KB (gzipped)
- **Critical CSS**: < 20KB (inline)
- **Total CSS**: < 30KB (gzipped)
- **Images**: WebP/AVIF, < 100KB each

## Security Considerations

### Implemented
- Input sanitization (`src/utils/sanitize.ts`)
- XSS prevention in user content
- `rel="noopener"` on external links
- Content Security Policy headers (via Caddy)
- No inline event handlers
- Type-safe content schemas

### Best Practices
1. Never trust user input
2. Sanitize content before rendering
3. Use SafeLink for external URLs
4. Keep dependencies updated
5. Review security headers in Caddy config

## Troubleshooting

### Dev server not starting
```bash
rm -rf node_modules bun.lock
bun install
bun run dev
```

### Build fails
```bash
bun run typecheck  # Check for type errors
bun run lint       # Check for lint errors
```

### Images not optimizing
- Ensure Sharp is installed: `bun install sharp`
- Check image paths are correct
- Verify image dimensions aren't excessive

### Styles not updating
- Clear Astro cache: `rm -rf .astro`
- Rebuild: `bun run build`

## Resources

### Documentation
- Astro: https://docs.astro.build
- Tailwind CSS: https://tailwindcss.com/docs
- MDX: https://mdxjs.com

### Project-Specific
- Site: https://clauzier.dev
- Analytics: https://plausible.clauzier.dev

## Important Notes for Claude Code

### DO:
✓ Use existing components before creating new ones
✓ Follow the cyberpunk aesthetic (terminal green, dark bg)
✓ Optimize for performance - every byte matters
✓ Write type-safe TypeScript
✓ Test builds before considering task complete
✓ Keep it simple - avoid over-engineering
✓ Use Bun for all package management
✓ Maintain accessibility (ARIA, semantic HTML)

### DON'T:
✗ Add heavy JavaScript frameworks (React, Vue, etc.)
✗ Create unnecessary abstractions
✗ Add performance monitoring tools (no BundleOptimizer, PerformanceMonitor)
✗ Use SSR or server-side features (static only)
✗ Add @astrojs/node or other SSR adapters
✗ Ignore bundle size impacts
✗ Skip image optimization
✗ Add features without user request

### When in doubt:
1. Check if it makes the site faster
2. Prefer static over dynamic
3. Less code is better
4. Ask the user

---

**Last Updated**: 2025-12-31
**Astro Version**: 5.16.6
**Node Version**: Compatible with Bun latest
