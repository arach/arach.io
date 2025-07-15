---
author: Arach Tchoupani
pubDatetime: 2025-01-15T16:00:00Z
title: Setting up Claude hooks for macOS notifications
tags:
  - claude
  - automation
  - macos
description: How to get system notifications when Claude performs certain actions
---

Today I learned how to set up hooks in Claude to trigger macOS notifications when certain actions are performed.

## What are Claude hooks?

Claude hooks are shell commands that execute in response to specific events during a Claude session. They can be configured in your Claude settings to run before or after tool executions.

## Setting up notifications

I configured hooks to send macOS notifications using the `osascript` command whenever Claude performs file operations:

```bash
# Example hook configuration for file edits
osascript -e 'display notification "Claude edited: filename.tsx" with title "Claude Code"'
```

## Use cases

This is particularly useful for:
- **Awareness** - Know when Claude modifies files without watching the terminal
- **Multi-tasking** - Get notified while working in other applications
- **Debugging** - Track which files Claude is touching during complex operations
- **Peace of mind** - Confirmation that actions are being executed

## Benefits discovered

1. **Non-intrusive monitoring** - Notifications appear in the corner without interrupting workflow
2. **Audit trail** - macOS Notification Center keeps a history of recent actions
3. **Selective alerts** - Can configure different hooks for different tools (Read, Write, Edit, etc.)

## Pro tip

You can also add sound alerts or use different notification styles:
```bash
# With sound
osascript -e 'display notification "File saved!" with title "Claude" sound name "Glass"'

# As an alert (requires dismissal)
osascript -e 'display alert "Claude completed task" message "Check your files"'
```

This simple automation has made working with Claude much more transparent and confidence-inspiring!