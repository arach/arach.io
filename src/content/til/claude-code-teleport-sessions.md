---
author: Arach Tchoupani
pubDatetime: 2026-01-03T12:00:00Z
title: Teleporting Claude Code sessions between CLI and web
tags:
  - claude
  - cli
  - productivity
description: How to seamlessly transfer Claude Code sessions between your local terminal and claude.ai/code using the --teleport flag
---

Today I learned about the `--teleport` flag in Claude Code CLI, which enables seamless session transfer between your local terminal and the web-based version at claude.ai/code.

This came from [a thread on X](https://x.com/arach/status/2007192120755663199) where I asked Boris Cherny ([@bcherny](https://x.com/bcherny)), creator of Anthropic's Claude Code CLI, about using the `&` suffix to transfer local terminal sessions to the web interface. The handoff feature was introduced in Claude Code v2.0.45.

## The Problem

You're on your phone or laptop browser, you start a coding task on claude.ai/code in their sandboxed environment. It's working on your GitHub repo, making progress. But now you want to take over locally for finer control, or you need to run something that requires your local environment.

## The Solution: Teleport

### Web to Local CLI

When working on claude.ai/code, you'll see an **"Open in CLI"** button. Clicking it gives you a command like:

```bash
claude --teleport session_abc123xyz
```

Run this in your project directory and it:
- Downloads the full conversation history
- Syncs any file changes made in the web session
- Preserves git state (checks out branches created remotely)
- Restores the model context for seamless continuation

### Local CLI to Web

Even cooler: append `&` to any prompt in the CLI to dispatch it as a background task that teleports to claude.ai/code:

```bash
> Refactor the authentication module to use OAuth2 &
```

This sends the session to the web for execution in Anthropic's sandbox while freeing your local terminal. You can later retrieve it back to CLI with `--teleport`.

## Why This Matters

Boris Cherny (creator of Claude Code) shared that he runs 5 parallel CLI instances alongside 5-10 web sessions for multitasking. The teleport feature enables:

- **Device switching** - Start on phone, finish on desktop
- **Parallel workflows** - Multiple sessions running simultaneously
- **Full context preservation** - Conversation, files, git changes, model state all sync
- **Async execution** - Queue up work and continue doing other things

## Tips

1. Make sure you're in the correct local directory before teleporting
2. Pull latest changes if your repo has been modified remotely
3. Requires Claude Pro/Max subscription for web features

## From the Community

In the [discussion thread](https://x.com/ovitrif/status/2007243876353093683), developers shared visuals illustrating the seamless CLI-web integration. The consensus: this hybrid workflow combines the power of local CLI (full shell access) with web's async sandboxing. Game changer for productivity.
