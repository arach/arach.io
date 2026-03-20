---
title: "Building a Highlight Reel Without Watching the Video"
author: Arach Tchoupani
pubDatetime: 2026-03-20T12:00:00.000Z
slug: ai-assisted-video-editing
featured: true
draft: true
description: "How I used Claude Code, Claude's vision API, and Remotion to turn a raw screen recording into a 45-second highlight reel without ever pressing play on the source footage."
tags:
  - AI
  - video editing
  - Remotion
  - Claude
  - workflow
---

I had a 12-minute screen recording of a design session. Hudson, our generative design system, was building a logo from a single prompt. I wanted a 45-second highlight reel out of it. Normally I'd scrub through the footage, find the good parts, cut and crop, add transitions, render. Instead I built a pipeline that does all of that without me watching a single frame.

The stack: ffmpeg for frame extraction, Claude Haiku's vision API for understanding what's in each frame, Remotion for compositing the final video in React. Claude Code orchestrated the whole thing.

## Extracting frames from raw footage

You can't feed a 12-minute video into a vision model. The pipeline breaks it down in two layers.

The first layer runs ffmpeg's scene detection at multiple sensitivity thresholds (0.08, 0.04, 0.02) to find natural cut points where the visual content changes. Screen recordings are tricky here because the changes are subtle compared to camera footage. A cursor moving or a panel opening doesn't register at the default threshold. The pipeline tries progressively lower thresholds until it gets between 5 and 80 scene breaks, extracts a keyframe JPEG at each one, and caps at 60 frames total.

```bash
ffmpeg -i input.mp4 -vf "select='gt(scene,0.04)',showinfo" -f null -
```

The second layer does pixel-diff scoring. It downsamples the video to a tiny 80x45 grayscale grid at 2fps and compares consecutive frames pixel by pixel. Every segment gets classified as idle (nothing happening), active (things changing on screen), or transition (brief visual change). Idle segments get skipped in later analysis. No point asking a vision model to describe a frozen screen.

## Vision analysis with Claude Haiku

Each extracted keyframe gets sent as a base64 JPEG to Claude Haiku's vision API via the Anthropic SDK, in batches of 5. The prompt asks for a short description and a content type classification.

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

The `contentType` field is one of `code-editor`, `terminal`, `browser`, `ui-demo`, `slide`, `transition`, `desktop`, or `other`. At roughly $0.003 per frame, the entire analysis for a 12-minute video costs about 18 cents. The model returns things like "VS Code showing a React component with Tailwind classes being refactored" or "Terminal output from a build process." Combined with the pixel-diff activity data, the pipeline now knows both what is on screen and how much is happening in each segment.

A final editorial pass feeds all of this into Claude to produce an Edit Decision List (EDL), a JSON file with scenes, timestamps, highlight moments, suggested 30-90 second clips, and dead time to cut. That EDL is what drives the composition.

## From EDL to Remotion composition

Remotion turns React components into video. The EDL maps onto a clip array where each entry is a labeled segment with a start time and duration from the source:

```typescript
interface Clip {
  label: string;
  sublabel: string;
  startFrom: number; // seconds into source video
  duration: number;  // seconds to show
}
```

The composition opens with a `PromptCard`, a typewriter-animated intro that types out the original design prompt with a blinking cursor and scanline effects. Then the clips play in sequence, each wrapped in a Remotion `Sequence`. The trick for smooth transitions is overlapping sequences: each clip starts 18 frames (~0.6s) before the previous one ends, so the fade-out of one clip blends with the fade-in of the next. No separate transition layer needed.

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

Each `VideoClip` handles its own fade-in and fade-out with cubic easing. Music runs on a separate layer with volume fades (1.5s in, 2s out), and sound effects drop at specific moments.

Because it's all React, changing anything is just changing code. Clip order is an array. Dissolve duration is a constant. Timing is two numbers. I kept finding myself saying "what if we tried..." and having the answer rendered in seconds.

## Precision crop framing

The source video was 2550x1440, a full desktop capture. The actual app window only spans about 72% of the frame. Showing the full desktop would waste most of the viewport on menubar and empty space.

I measured the pixel boundaries of the app window in the source and turned them into crop constants:

```typescript
const CROP_SCALE = 1.4;
const CROP_CENTER_X = 0.37;   // slightly right of app center
const INNER_SCALE_X = 0.72;   // app spans 72% of frame width
const INNER_SCALE_Y = 0.64;   // 64% vertically, more top/bottom padding
```

Each `VideoClip` uses these to position and scale the `OffthreadVideo` element. The math turns percentage-based crop specs into pixel offsets on the 1920x1080 output canvas:

```typescript
const scaledW = innerW * CROP_SCALE;
const scaledH = innerH * CROP_SCALE;
const left = padX - (scaledW * CROP_CENTER_X - innerW * 0.5);
const top = padY - (scaledH - innerH) / 2;
```

Same parameters for every clip, since the app window doesn't move. The result looks like a clean product demo instead of a screen recording.

## Iterating

Every layer caches its results (scene breaks, activity scores, vision tags), so re-running the pipeline only redoes what changed. In practice, the workflow looks like this:

1. Run the full analysis (~2 minutes for a 12-minute video)
2. Review the EDL
3. Tell Claude Code to adjust clip selection or timing
4. Re-render with Remotion (composition changes only, no re-analysis)
5. Watch the result, tweak, repeat

Most rounds only touch steps 3-5. The vision analysis and frame extraction are one-time costs. I'd say things like "make the intro snappier" or "drop the idle section at 4:30" and Claude Code would translate that into clip array edits and re-render.

## What surprised me

Claude Haiku's frame descriptions were accurate enough to build an EDL from scratch. It correctly distinguished code editing, UI demos, terminal output, and transitions. The main failure mode was over-describing simple frames, which is easy to filter.

The thing I didn't expect was how much treating video as code would change the editing process. Every edit is a code change, which means version control, branching, and diffing all apply. I could ask Claude Code to "try a version with faster cuts" and have a new composition in seconds, then `git diff` to see exactly what changed. That feedback loop is very different from dragging clips around in a timeline editor.

Caching made the whole thing practical. Frame extraction and vision API calls only run once. Everything after that is fast iteration on React renders.

The pipeline is a project called Premotion, about 700 lines of TypeScript for the analysis script plus standard Remotion compositions. Runs locally with ffmpeg and one API key. Forty-five seconds of video, zero seconds of watching the source.
