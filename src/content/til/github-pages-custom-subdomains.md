---
author: Arach Tchoupani
pubDatetime: 2025-08-06T09:00:00Z
title: Setting Up GitHub Pages with Custom Subdomains
tags:
  - github
  - dns
  - deployment
  - web development
description: Quick guide to hosting GitHub Pages on a custom subdomain like speakeasy.arach.dev
---

Today I learned how to set up GitHub Pages with a custom subdomain, which I used for my [SpeakEasy documentation site](https://speakeasy.arach.dev/).

*This builds on the [basic GitHub Pages setup](/til/setting-up-github-pages-basics/) - make sure you have that working first!*

## The Goal
Host a GitHub Pages site at `speakeasy.arach.dev` instead of the default `username.github.io/repo-name` URL.

## Step-by-Step Setup

### 1. Configure GitHub Pages
In your repository:
- Go to **Settings** → **Pages**
- Set **Source** to "Deploy from a branch"
- Choose your branch (usually `main` or `gh-pages`)

### 2. Add Custom Domain
- In the **Custom domain** field, enter: `speakeasy.arach.dev`
- This creates a `CNAME` file in your repository root

### 3. Configure DNS Records
In your domain's DNS settings (I use Cloudflare), add a **CNAME record**:
```
Type: CNAME
Name: speakeasy
Target: arach.github.io
Proxy: DNS only (gray cloud)
```

### 4. Wait for DNS Propagation
- Can take up to 24 hours
- Check with: `dig speakeasy.arach.dev`
- Should return your GitHub Pages IP

### 5. Enable HTTPS
- Back in GitHub Pages settings
- Check **Enforce HTTPS** (may take a few minutes to become available)

## Key Gotchas
- **Don't proxy through Cloudflare** initially - use "DNS only" mode
- The CNAME target is your **username**.github.io, not the full repo URL
- GitHub automatically handles the redirect from your custom domain to the right repository

## Result
Your site is now live at `https://speakeasy.arach.dev` with automatic HTTPS! 🎉

This setup is perfect for documentation sites, project demos, or any static content you want on a branded subdomain.