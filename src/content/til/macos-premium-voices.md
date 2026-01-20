---
author: Arach Tchoupani
pubDatetime: 2026-01-20T12:00:00Z
title: macOS has surprisingly good premium voices you can download for free
tags:
  - macos
  - accessibility
  - voice
  - text-to-speech
description: Discovered that macOS includes downloadable high-quality voices that rival commercial TTS services
---

Today I learned that macOS has an incredible hidden gem: premium downloadable voices that are shockingly good quality, and they're completely free.

## Hear It For Yourself

Here's Evan (Enhanced) with a quick demo:

<audio controls src="/audio/macos-premium-voice-sample.m4a">
  Your browser does not support the audio element.
</audio>

## Where to Find Them

1. Open **System Settings**
2. Go to **Accessibility** > **Spoken Content**
3. Click the info button next to **System voice**
4. Browse the available voices and click **Download** on any you want

That's it. Apple will download the enhanced voice directly to your Mac.

## Why This Matters

I used to throttle my usage of voice features to avoid subscribing to paid services. Now I can use these built-in voices as much as I want. They have natural intonation, proper pacing, and less of that robotic quality you'd expect from system voices. It's not perfect, but it's free and reasonably fast on M1+.

## The Possibilities

This discovery opens up interesting opportunities:

- **Local TTS** - No API calls, no latency, no costs
- **Offline capable** - Works without internet once downloaded
- **Privacy** - Your text never leaves your machine
- **Integration** - The `say` command works with any downloaded voice:

```bash
# List all available voices
say -v '?'

# Use a specific voice
say -v "Samantha (Enhanced)" "Hello, this is a premium voice"
```

## Combining with Scripts

You can use these voices in shell scripts, automation, or as a fallback when cloud TTS services are unavailable:

```bash
# Simple notification script
say -v "Samantha (Enhanced)" "Build completed successfully"
```

## Voice Recommendations

Some voices to try:
- **Evan (Enhanced)** - Natural American English (used in the demo above)
- **Zoe (Premium)** - Often cited as the most natural-sounding
- **Samantha (Enhanced)** - Close to Siri's default voice
- **Daniel (Enhanced)** - British English

The enhanced/premium versions are significantly better than the default compact voices. Worth downloading a few to compare.

## What I Actually Use

I built [Speakeasy](https://github.com/arach/speakeasy) to cache calls to API providers like ElevenLabs and OpenAI. I use it to announce Claude hooks and status notifications while I code. It's still my preferred method, but the built-in voices are a solid free alternative when you don't need top-tier quality.

## Reference

Apple's official guide: [Change Spoken Content settings on Mac](https://support.apple.com/en-gb/guide/mac-help/mchlp2290/mac)
