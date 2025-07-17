---
author: Arach Tchoupani
pubDatetime: 2025-07-17T16:00:00Z
title: Using Kimi K2 as a Claude backup
tags:
  - claude
  - ai
  - tools
  - kimi
description: Quick setup for using Kimi when Claude is having issues
---

KimiK2 can serve as a backup when Claude is experiencing downtime or other issues.

## The Problem

Sometimes Claude has downtime or performance issues - and sometimes I just run out of tokens on $200/mo plan so it's nice to have a backup plan that uses my same exact setup

## The Solution: Kimi by MoonshotAI

Here's how to quickly switch to Kimi while keeping the Claude interface:

1. **Sign up** at https://platform.moonshot.ai/
2. **Generate an API key** from the console
3. **Add credits** to your account (just a few dollars)
4. **Set environment variables**:
   ```bash
   export ANTHROPIC_BASE_URL="https://api.moonshot.ai/anthropic"
   export ANTHROPIC_API_KEY="sk-…"
   ```
5. **Run Claude normally** - you'll see a message about the API overrides

That's it! You're now using KimiK2 through Claude's interface.

## Why This Matters

Having a backup AI model means you don't have to stop working when Claude is down. At this point, I think writing code by hand just feels archaic, so I won't do it and Cursor's nice but CC is just better. Having this setup ready gives me peace of mind.

## More Info

I shared this on X: https://x.com/arach/status/1945879399523385425