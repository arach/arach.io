---
author: Arach Tchoupani
pubDatetime: 2026-03-20T12:00:00.000Z
title: Building a highlight reel without watching the video
tags:
  - AI
  - video editing
  - Remotion
  - Claude
description: "Using Claude Haiku vision + ffmpeg + Remotion to turn a 12-minute screen recording into a 45-second highlight reel without pressing play."
---

Built a pipeline that turns raw screen recordings into highlight reels without watching the source. Used it on a 12-minute Hudson design session to produce a 45-second reel.

## The pipeline

Four layers, each feeding the next:

1. **ffmpeg scene detection** at adaptive thresholds (0.08 → 0.04 → 0.02) extracts up to 60 keyframes as 640px JPEGs
2. **Pixel-diff scoring** at 2fps on 80x45 grayscale classifies segments as active/idle/transition
3. **Claude Haiku vision** tags each keyframe with content type (`code-editor`, `terminal`, `ui-demo`, etc.) and a description, ~$0.003/frame
4. **Editorial pass** produces an EDL (Edit Decision List) with highlights, suggested clips, and dead time

## Remotion composition

The EDL maps to a clip array. Each clip is a `Sequence` in Remotion with overlapping cross-dissolves:

```typescript
const OVERLAP_FRAMES = 18; // ~0.6s cross-dissolve

let cursor = introFrames + promptFrames;
const clipSequences = CLIPS.map((clip, i) => {
  const clipFrames = Math.floor(clip.duration * fps);
  const from = cursor;
  cursor += clipFrames - OVERLAP_FRAMES;
  return { clip, from, clipFrames, index: i };
});
```

Opens with a `PromptCard` typewriter intro, then content clips with cubic-eased fades, then outro. Music and SFX on separate layers.

## Crop framing

Measured the app window's pixel boundaries in the source (2550x1440) and turned them into constants:

```typescript
const CROP_SCALE = 1.4;
const CROP_CENTER_X = 0.37;
const INNER_SCALE_X = 0.72;
const INNER_SCALE_Y = 0.64;
```

Same crop for every clip since the window doesn't move. Turns a desktop recording into a clean product demo.

## The surprise

Treating video as code changed the editing loop completely. Every edit is a code change, so `git diff` shows exactly what changed between versions. Claude Code translates "make the intro snappier" into clip array edits. Each layer caches results, so iteration only re-renders the composition.

The pipeline is called Premotion. About 700 lines of TypeScript for analysis, standard Remotion compositions. Runs locally with ffmpeg and one API key.
