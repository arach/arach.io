---
author: Arach Tchoupani
pubDatetime: 2025-07-15T14:30:00Z
title: Setting Up GitHub Pages - The Basics
tags:
  - github
  - static sites
  - deployment
  - web development
description: Getting started with GitHub Pages for free static site hosting
---

Today I learned the fundamentals of setting up GitHub Pages for free static site hosting.

## What is GitHub Pages?

GitHub Pages is a free static site hosting service that lets you publish websites directly from your GitHub repositories. Perfect for:
- Project documentation
- Portfolio sites
- Landing pages
- Static blogs

## Real Example: SpeakEasy Documentation

Let me walk through a real setup using my [SpeakEasy repository](https://github.com/arach/speakeasy) which hosts documentation at [speakeasy.arach.dev](https://speakeasy.arach.dev/).

### 1. Repository Structure
The SpeakEasy repo has a `landing/` folder containing a Next.js app:
```
speakeasy/
├── landing/           (Next.js documentation site)
│   ├── app/
│   ├── components/
│   ├── package.json
│   └── next.config.mjs
├── CNAME             (custom domain: speakeasy.arach.dev)
└── .github/workflows/deploy-landing.yml
```

### 2. GitHub Actions Workflow
Instead of basic branch deployment, I use GitHub Actions for automated builds:

```yaml
# .github/workflows/deploy-landing.yml
name: Deploy Landing Page
on:
  push:
    branches: [ master ]
    paths: ['landing/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pages: write
      id-token: write
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    - run: npm install --legacy-peer-deps
      working-directory: ./landing
    - run: npm run export
      working-directory: ./landing
    - uses: actions/configure-pages@v4
    - uses: actions/upload-pages-artifact@v3
      with:
        path: ./landing/out
    - uses: actions/deploy-pages@v4
```

### 3. Enable GitHub Pages
In repository **Settings** → **Pages**:
- **Source**: "GitHub Actions" (not branch deployment)
- The workflow handles building and deployment automatically

## Key Takeaways from the SpeakEasy Setup

- **GitHub Actions** is more powerful than basic branch deployment
- **Monorepo friendly** - only deploys when `landing/` changes
- **Build optimization** - caches dependencies for faster builds
- **Automatic deployment** - pushes to `master` trigger builds

## Pro Tips
- Check the **Actions** tab to monitor deployment status
- Use `working-directory` for monorepos with subdirectories
- Cache dependencies (`actions/cache@v4`) for faster builds
- Custom 404 pages work - just add a `404.html` file

## What's Next?
Once you've got the basics down, check out my follow-up TIL on [custom domains and subdomains](/til/github-pages-custom-subdomains/) using the SpeakEasy setup as an example.

GitHub Pages + GitHub Actions is incredibly powerful - perfect for documentation sites and project demos! 🚀