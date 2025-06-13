# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

arach.io is a personal website and blog built with Astro.js, featuring blog posts, book reviews, and memos. The site uses React for interactive components and Tailwind CSS for styling.

## Development Commands

```bash
# Install dependencies
bun install

# Start development server
bun dev  # or bun start

# Build for production (includes jampack optimization)
bun build

# Preview production build
bun preview

# Format code
bun format

# Run linting
bun lint
```

## Architecture

### Technology Stack
- **Astro** (v4.8.4) - Static site generator with island architecture
- **React** (v18.3.1) - For interactive components (Search, theme toggle)
- **TypeScript** - Type safety across the codebase
- **Tailwind CSS** - Utility-first styling with custom theme extensions
- **Bun** - Primary package manager

### Content Architecture
The site uses Astro's Content Collections for managing three types of content:
- **Blog posts** (`src/content/blog/`) - Technical articles and thoughts
- **Book reviews** (`src/content/book/`) - Book notes and reviews
- **Memos** (`src/content/memo/`) - Short-form content

Each content type has:
- Markdown files with frontmatter metadata
- Type-safe schemas defined in `src/content/config.ts`
- Dedicated layout components in `src/layouts/`
- Dynamic routing via `src/pages/[collection]/[slug]/index.astro`

### Key Implementation Details

1. **Search Functionality** (`src/components/Search.tsx`)
   - Client-side fuzzy search using Fuse.js
   - Searches across all content types
   - Accessible via `/search` or keyboard shortcut

2. **Theme System**
   - Dark/light mode toggle stored in localStorage
   - Handled by `public/toggle-theme.js` (runs before page load to prevent flash)
   - CSS variables defined in `src/styles/global.css`

3. **Image Optimization**
   - Uses Sharp for image processing during build
   - OG images generated dynamically for social sharing
   - Images stored in `src/assets/` for build-time optimization

4. **Performance Optimizations**
   - Static generation by default
   - Jampack post-processing for additional optimizations
   - Google Analytics loaded via Partytown web worker
   - Font subsetting and preloading

### Development Workflow

When adding new content:
1. Create markdown file in appropriate content directory
2. Include required frontmatter (see existing files for examples)
3. Images go in `src/assets/` for optimization
4. Run `bun dev` to preview changes
5. Commit using conventional commits (enforced by Commitizen)

When modifying components:
1. React components use `.tsx` extension
2. Astro components use `.astro` extension
3. Follow existing patterns for props and TypeScript types
4. Styles use Tailwind classes, avoid inline styles

### Important Configuration Files
- `astro.config.ts` - Core Astro configuration and integrations
- `src/config.ts` - Site metadata and constants
- `tailwind.config.cjs` - Custom theme extensions and typography settings
- `tsconfig.json` - TypeScript paths and compiler options