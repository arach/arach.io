---
title: "Building a Highlight Reel Without Watching the Video"
author: Arach Tchoupani
pubDatetime: 2026-03-20T12:00:00.000Z
slug: ai-assisted-video-editing
featured: true
draft: true
description: "How I used Claude Code, Claude's vision API, and Remotion to turn a raw screen recording into a 45-second highlight reel — without ever pressing play on the source footage."
tags:
  - AI
  - video editing
  - Remotion
  - Claude
  - workflow
---

I had a 12-minute screen recording of a design session — Hudson, our generative design system, building a logo from a single prompt. I wanted a 45-second highlight reel. The normal workflow: scrub through the footage, find the good parts, cut, crop, add transitions, render. Instead, I built a pipeline that does all of that without watching a single frame.

The stack: ffmpeg for frame extraction, Claude Haiku's vision API for understanding what's in each frame, and Remotion for compositing the final video in React. Claude Code orchestrated the whole thing.

## Extracting the Story from Raw Footage

The first step is turning a continuous video into something an AI can reason about. The pipeline works in layers.

**Layer 1** runs ffmpeg's scene detection at multiple sensitivity thresholds (0.08, 0.04, 0.02) to find natural cut points — moments where the visual content changes significantly. It extracts a keyframe JPEG at each detected scene break, capping at 60 frames to keep things manageable.

```bash
ffmpeg -i input.mp4 -vf "select='gt(scene,0.04)',showinfo" -f null -
```

**Layer 2** does pixel-diff scoring. It downsamples the video to a tiny 80x45 grayscale grid at 2fps and compares consecutive frames pixel by pixel. This classifies every segment as idle (nothing happening), active (gameplay), or transition (scene change). The idle segments get skipped in later analysis — no point asking an AI to describe a frozen screen.

## Seeing Through Claude's Eyes

This is where it gets interesting. Each extracted keyframe gets sent to Claude Haiku's vision model via the Anthropic SDK. The prompt is simple: describe what's happening, tag it, classify the content type.

```typescript
const response = await client.messages.create({
  model: "claude-haiku-4-5-20251001",
  max_tokens: 300,
  messages: [{
    role: "user",
    content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: frameData } },
      { type: "text", text: `Describe this frame in 1-2 sentences. Return JSON: {"tags": [...], "description": "...", "contentType": "..."}` },
    ],
  }],
});
```

At roughly $0.003 per frame and ~60 frames per video, the entire analysis costs about 18 cents. The model returns structured descriptions like "VS Code with a TypeScript file open, refactoring a component" or "Terminal showing build output with successful compilation." These descriptions become the editorial backbone — an AI storyboard that no human had to write.

The pipeline runs an editorial pass over these descriptions, identifying highlights, suggested clips, and dead time. The output is an Edit Decision List (EDL) — a JSON file with timestamps, scene metadata, and clip recommendations.

## From Descriptions to Compositions

Remotion turns React components into video. The EDL's scene descriptions map directly onto a clip array — each entry is a labeled segment with a start time and duration from the source footage:

```typescript
interface Clip {
  label: string;
  sublabel: string;
  startFrom: number; // seconds into source video
  duration: number;  // seconds to show
}
```

The composition opens with a `PromptCard` — a typewriter-animated intro that shows the original prompt that kicked off the design session, complete with a blinking cursor and scanline effects. Then clips play in sequence, each wrapped in a Remotion `Sequence` component. The key trick is overlapping sequences: each clip starts 18 frames (~0.6s) before the previous one ends, creating smooth cross-dissolves without a separate transition layer.

```typescript
const OVERLAP_FRAMES = 18;

let cursor = introFrames + promptFrames;
const clipSequences = CLIPS.map((clip, i) => {
  const clipFrames = Math.floor(clip.duration * fps);
  const from = cursor;
  cursor += clipFrames - OVERLAP_FRAMES;
  return { clip, from, clipFrames, index: i };
});
```

Each `VideoClip` handles its own fade-in and fade-out with cubic easing, so overlapping sequences blend naturally. Audio runs on a separate layer — music fades in over 1.5 seconds, fades out over the last 2 seconds, and sound effects drop in at specific moments.

The composition is just React. Want to change the clip order? Reorder the array. Want longer dissolves? Change `OVERLAP_FRAMES`. Want to try a tighter cut? Adjust two duration numbers. This is the real power of treating video as code.

## Precision Crop Framing

The highlight reel needed to feel intentional, not like a random crop of a screen recording. The source was 2550x1440, but the app region only spans about 72% of the frame horizontally. Showing the full frame would waste most of the viewport on empty desktop.

The solution is a set of crop constants derived from measuring the actual pixel boundaries of the app in the source video:

```typescript
const CROP_SCALE = 1.4;
const CROP_CENTER_X = 0.37;   // slightly right of app center
const INNER_SCALE_X = 0.72;   // app spans 72% of frame width
const INNER_SCALE_Y = 0.64;   // 64% vertically — more top/bottom padding
```

Each `VideoClip` uses these to calculate the exact position and scale of the `OffthreadVideo` element. The math translates percentage-based crop specs into pixel offsets within the 1920x1080 output canvas:

```typescript
const scaledW = innerW * CROP_SCALE;
const scaledH = innerH * CROP_SCALE;
const left = padX - (scaledW * CROP_CENTER_X - innerW * 0.5);
const top = padY - (scaledH - innerH) / 2;
```

The result is a frame that shows just the app region, slightly zoomed, with balanced padding on all sides. No manual keyframing — the crop parameters apply uniformly across all clips, giving the reel a consistent, intentional feel.

## The Iterative Loop

This pipeline isn't fire-and-forget. Each layer caches its results (scene breaks, activity scores, vision analysis), so re-running is cheap. The typical workflow:

1. Run the full analysis pipeline (~2 minutes for a 12-minute video)
2. Review the generated EDL and storyboard
3. Ask Claude Code to adjust clip selection or timing
4. Re-render with Remotion (only the composition changes, no re-analysis needed)
5. Watch the 45-second result, tweak, repeat

Most iterations only touch step 3-5. The vision analysis and frame extraction are one-time costs. Claude Code acts as the editorial brain — "make the intro snappier," "drop the idle section at 4:30," "zoom into the score screen" — and translates those instructions into clip array modifications.

## What I Learned

**Vision models are surprisingly good editors.** Claude Haiku's frame descriptions were accurate enough to build an EDL from scratch. It correctly identified code editing sessions, UI demos, terminal output, and transition screens. The main failure mode was over-describing simple frames, but that's easy to filter.

**Treating video as code changes everything.** Remotion's React-based approach means every edit is a code change. Version control, branching, diffing — all the tools we take for granted in software development suddenly apply to video editing. I can ask Claude Code to "try a version with faster cuts" and get a new composition in seconds.

**Caching is essential.** The layered caching strategy (breaks, segments, tags) means the expensive operations — frame extraction and vision API calls — only run once. Everything downstream is fast iteration on cheap React renders.

**The 80/20 of video editing is selection, not effects.** The hardest part of making a highlight reel is deciding what to keep. Once the vision model handles that, the rest is mechanical. Transitions, zooms, and framing are just configuration.

The full pipeline lives in a project called Premotion — a Remotion-based toolkit for programmatic video editing. The vision analysis script is about 700 lines of TypeScript. The Remotion compositions are standard React components. The whole thing runs locally with ffmpeg and a single API key.

Forty-five seconds of video. Zero seconds of watching the source. Not bad.
