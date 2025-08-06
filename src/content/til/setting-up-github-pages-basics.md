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

## Basic Setup Steps

### 1. Create a Repository
- Create a new repository on GitHub
- Name it anything (e.g., `my-awesome-site`)
- Make it public (required for free accounts)

### 2. Add Your Site Files
Add your static files to the repository:
```
index.html          (your homepage)
style.css           (optional styling)
script.js           (optional JavaScript)
assets/             (images, etc.)
```

### 3. Enable GitHub Pages
In your repository:
- Go to **Settings** → **Pages**
- Under **Source**, select "Deploy from a branch"
- Choose **main** branch and **/ (root)** folder
- Click **Save**

### 4. Access Your Site
Your site will be available at:
```
https://[username].github.io/[repository-name]
```

## Pro Tips
- Changes take 1-10 minutes to deploy
- Use `README.md` if you don't have `index.html` (GitHub renders it automatically)
- Check the **Actions** tab to see deployment status
- Custom 404 pages work - just add a `404.html` file

## What's Next?
Once you've got the basics down, you can explore:
- Custom domains and subdomains
- Jekyll integration for blogging
- GitHub Actions for advanced builds

GitHub Pages is incredibly powerful for such a simple service - perfect for getting projects online quickly! 🚀