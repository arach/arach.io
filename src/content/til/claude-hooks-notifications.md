---
author: Arach Tchoupani
pubDatetime: 2025-01-15T16:00:00Z
title: Claude hooks with voice notifications using Speakeasy
tags:
  - claude
  - automation
  - voice
  - speakeasy
description: How I set up Claude to speak notifications using a TypeScript hook and Speakeasy
---

Today I learned how to create an advanced Claude notification system that not only captures events but also speaks them aloud using Speakeasy.

## The Setup

Claude hooks can be configured in `~/.claude/settings.json` to run custom scripts. I created a TypeScript notification handler that:

1. Captures Claude notifications
2. Copies the JSON payload to clipboard
3. Speaks contextual messages using Speakeasy

## The Hook Configuration

```json
{
  "hooks": {
    "Notification": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "pnpx tsx /Users/arach/.claude/hooks/notification.ts"
          }
        ]
      }
    ]
  }
}
```

## The Magic: notification.ts

The TypeScript hook does three clever things:

### 1. JSON Capture to Clipboard
```typescript
const formattedJson = JSON.stringify(notificationData, null, 2);
execSync('pbcopy', { input: formattedJson });
```
This is brilliant for debugging - every notification is instantly available to paste and inspect.

### 2. Project Context Extraction
The script intelligently extracts the project name from the transcript path:
```typescript
const pathMatch = transcriptPath.match(/projects\/[^\/]*-([^\/]+)\//);
if (pathMatch) {
  projectName = pathMatch[1].replace(/-/g, ' ');
}
```

### 3. Natural Speech with Speakeasy
Instead of robotic notifications, it creates contextual messages using [Speakeasy](https://github.com/arach/speakeasy):
```typescript
// Examples:
"In blink, Claude is waiting for you"
"In arach io, Claude needs your permission"
"In speech service, Claude has a request for you"

await speak(message, { 
  priority: 'high',
  provider: 'groq' 
});
```

## Why This Is Awesome

1. **Multi-project awareness** - Know which project needs attention without looking
2. **Hands-free updates** - Continue coding while Claude speaks status updates
3. **Debug-friendly** - Every notification payload is in your clipboard
4. **Natural language** - Messages are cleaned up for better speech synthesis

## Testing the Hook

```bash
echo '{"message": "Build completed successfully", "transcript_path": "/Users/arach/dev/speech-service"}' | pnpx tsx notification.ts
```

This setup transforms Claude from a silent assistant to a conversational coding partner that keeps you informed without breaking your flow!