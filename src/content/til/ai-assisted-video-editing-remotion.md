---
author: Arach Tchoupani
pubDatetime: 2026-03-20T12:00:00.000Z
title: Building a highlight reel without watching the video
tags:
  - AI
  - video editing
  - Remotion
  - MiniMax
  - Claude Code
description: "Using MiniMax M2.7 vision + Remotion to turn a 9-minute screen recording into a 45-second highlight reel — entirely through conversation."
---

Had a 9-minute screen recording of a design session in Hudson. Wanted a 45-second highlight reel. Never opened a video editor.

## Giving AI eyes into the video

Video files can't go directly into vision models, so ffmpeg extracts keyframes. Then MiniMax M2.7 (via MCP `understand_image` tool) analyzes each one. I fed it 7 frames sampled across the timeline and asked it to describe what's on screen.

The results were surprisingly precise — it identified the app name, specific design modules (Scout Radar, Scout Lattice, Scout Radio), the AI conversations happening in the terminal, even which slider the cursor was hovering over. From 7 frames, I had a complete narrative arc of the whole session.

## Video editing as conversation

This is the part that felt different. Instead of scrubbing a timeline, I described what I wanted:

- "Make a 45-second highlight reel capturing the good stuff"
- "The transitions are too rough, make them smooth cross-dissolves"
- "The S glyph is still inverted — push the timecode forward"
- "Squeeze everything in a bit more, I want to see the browser chrome"

Each note turned into a code change in a Remotion composition. Clips are `Sequence` elements with overlapping cross-dissolves. The whole edit is a React component:

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

Opens with a typewriter prompt card, five content clips with eased transitions, music on a separate layer, tactical intro and outro. Every iteration is just another conversation turn.

## What stuck with me

Video editing became conversational. "Make the intro snappier" turns into clip array edits. "Center it more" becomes a constant change. The feedback loop is talk → render → watch → talk, and it's fast enough that you stay in flow.

The setup is Claude Opus as the brain and MiniMax M2.7 as the eyes. Opus orchestrates the edit — writing Remotion compositions, adjusting timecodes, refining transitions. M2.7 handles vision through MCP, analyzing frames in parallel (7 calls at once) so the initial video understanding takes seconds. Neither could do this alone; together they turn a conversation into a rendered video.

Runs locally with Remotion and bun. No cloud rendering, no subscription editors. Just conversation.
