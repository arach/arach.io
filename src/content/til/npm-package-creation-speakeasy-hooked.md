---
author: Arach Tchoupani
pubDatetime: 2025-07-16T16:00:00Z
title: Creating npm packages with Speakeasy and connecting to Hooked notifications
tags:
  - npm
  - typescript
  - speakeasy
  - notifications
  - hooked
description: How to create and publish npm packages, featuring Speakeasy TTS library and its integration with Hooked notification system
---

Today I learned about creating npm packages and how Speakeasy connects beautifully with notifications through the new Hooked repository.

## Creating Your First npm Package

The basics of npm package creation are straightforward:

```bash
# Create new directory and initialize
mkdir my-package
cd my-package
npm init -y

# Set up TypeScript (optional but recommended)
npm install -D typescript @types/node
npx tsc --init
```

## Key Package.json Fields

For a successful npm package, focus on these essential fields:

```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "description": "Clear, concise description",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "files": ["dist"],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  },
  "keywords": ["relevant", "tags"],
  "repository": {
    "type": "git",
    "url": "https://github.com/username/repo.git"
  }
}
```

## Speakeasy: A Real Example

[Speakeasy](https://github.com/arach/speakeasy) ([npm](https://npmjs.com/package/@arach/speakeasy)) shows practical npm package patterns:

```typescript
import { speak } from '@arach/speakeasy';

await speak("Hello world!", {
  provider: 'elevenlabs',
  voice: 'alloy',
  priority: 'high'
});
```

Key patterns from Speakeasy:
- **Simple API** - One function abstracts multiple TTS engines
- **Provider flexibility** - Supports ElevenLabs, OpenAI, Groq, and more
- **Reasonable defaults** - Works without extensive configuration
- **TypeScript support** - Typed interfaces for better DX

## The Hooked Connection

The [Hooked](https://github.com/arach/hooked) repository contains the notification.ts hook that showcases Speakeasy in action. Hooked provides the Claude notification handler that leverages Speakeasy for voice notifications:

```typescript
// From Hooked's notification handler
import { speak } from '@arach/speakeasy';

const message = `In ${projectName}, Claude ${getActionMessage(action)}`;
await speak(message, { 
  priority: 'high',
  provider: 'elevenlabs'
});
```

This integration shows how npm packages (Speakeasy TTS wrapper) can be consumed by other projects (Hooked notification handler) to build useful functionality.

## Publishing Your Package

Before publishing:

```bash
# Build your package
npm run build

# Test locally
npm pack  # Creates .tgz file to inspect

# Publish to npm
npm publish
```

## Why This Pattern Works

The Speakeasy → Hooked pattern demonstrates excellent software design:

1. **Single responsibility** - Speakeasy wraps TTS engines, Hooked handles Claude notifications
2. **Composability** - Easy to integrate and extend
3. **Reusability** - Speakeasy can be used in any project needing TTS
4. **Clear interfaces** - Simple, typed APIs make integration seamless

## Pro Tips

- Always include a good README with examples
- Use semantic versioning strictly
- Test your package with `npm pack` before publishing
- Consider providing both ESM and CommonJS builds
- Include TypeScript definitions for better DX

The npm ecosystem thrives on small, focused packages that do one thing well. Speakeasy follows this approach as a TTS engine wrapper, and Hooked shows how these components can combine to create useful notification systems.