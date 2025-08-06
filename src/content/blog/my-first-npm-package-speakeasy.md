---
title: Shipped my first NPM package - meet SpeakEasy 🎤
pubDatetime: 2025-08-06T08:00:00Z
description: The journey of creating and publishing SpeakEasy, a unified text-to-speech library with smart caching and multiple provider support.
slug: my-first-npm-package-speakeasy
tags:
  - npm
  - open source
  - text-to-speech
  - javascript
  - libraries
  - side projects
featured: true
thumbnail: "/src/assets/images/speakeasy-cli-welcome.png"
---

After years of using npm packages, I finally published my first one. Meet [SpeakEasy](https://speakeasy.arach.dev/), a unified text-to-speech library that makes adding voice capabilities to applications simple.

## The Problem That Started It All

Working on various projects, I found myself repeatedly implementing text-to-speech functionality. Each time, I'd have to:

- Choose between different TTS providers (OpenAI, ElevenLabs, system voices)
- Handle API keys and configurations separately  
- Implement caching to avoid expensive repeated API calls
- Deal with volume control and audio management

The fragmentation was annoying. I wanted a single interface that could handle multiple providers with smart caching built-in. I was also seeing my credits get eaten up by repetitive generation, and there was this little nudge of latency I could do away with. Hence the cache implementation.

## What SpeakEasy Does

SpeakEasy is a unified TTS library that abstracts away the complexity of working with different speech synthesis providers. For me, it also removes the need to configure every project with all my keys - I can have one thing that has all my text-to-speech keys, and every project can use it. Here's what makes it useful:

### Multiple Provider Support
- **OpenAI TTS** - High-quality AI voices
- **ElevenLabs** - Premium voice synthesis  
- **Groq** - Fast and efficient processing
- **System Voices** - Built-in browser/OS voices

### Smart Caching
SpeakEasy automatically caches generated speech to avoid redundant API calls, which saves costs when dealing with repeated text.

### Developer Experience
The API is intentionally simple:

```javascript
import { SpeakEasy } from '@arach/speakeasy'

const speaker = new SpeakEasy({
  provider: 'openai',
  apiKey: 'your-api-key'
})

await speaker.speak('Hello, world!')
```

That's it. No complex setup, no provider-specific configurations to remember.

## Building It

### Architecture Decisions
I spent considerable time thinking about the architecture. The key insight was treating TTS providers as interchangeable plugins with a common interface. This meant:

1. **Provider abstraction** - Each provider implements the same interface
2. **Caching layer** - Sits between the user and providers
3. **Configuration management** - Unified settings across all providers
4. **Error handling** - Consistent error responses regardless of provider

### TypeScript
I used TypeScript for type safety and better developer experience with autocomplete and inline documentation.

### Testing Strategy
I implemented comprehensive testing covering:
- Unit tests for each provider
- Integration tests for the caching system  
- End-to-end tests with actual TTS providers
- Mock testing for CI/CD environments

## The Publishing Process

Publishing to npm for the first time taught me a few things:

### Package Preparation
- **Semantic versioning** - Starting at 1.0.0 felt significant
- **Documentation** - Created comprehensive docs at [speakeasy.arach.dev](https://speakeasy.arach.dev/)
- **Examples** - Added practical usage examples
- **Bundle optimization** - Ensured the package was lightweight

### CI/CD Pipeline
I set up automated publishing using GitHub Actions, which:
- Runs tests on multiple Node.js versions
- Builds the package
- Publishes to npm registry automatically on tagged releases

## What's Next

SpeakEasy is just getting started. Some features I'm excited to add:

- **SSML support** - Fine-grained control over speech synthesis
- **Streaming TTS** - Real-time speech generation
- **Voice customization** - Pitch, speed, and tone controls
- **More providers** - Azure, Google Cloud, and others

## Lessons Learned

A few things I learned:

1. **Start simple** - Don't try to solve every problem in v1
2. **Documentation is crucial** - Good docs can make or break adoption
3. **Community feedback** - Early user feedback is invaluable
4. **Maintenance matters** - Publishing is just the beginning

## Try It Out

If you're building something that needs text-to-speech capabilities, I'd love for you to try SpeakEasy:

```bash
npm install @arach/speakeasy
```

Check out the [documentation](https://speakeasy.arach.dev/) for comprehensive examples and API reference.

## Wrapping Up

Publishing my first npm package was a good experience and honestly pretty easy. It's nice to contribute something back to the ecosystem.

In retrospect, I should have shipped a few more by now. If you've got repeated patterns in your code, consider packaging them up. The JavaScript community benefits from this kind of sharing.

---

*Have you built something with SpeakEasy? I'd love to hear about it! Reach out on [X](https://x.com/arach) or [GitHub](https://github.com/arach).*