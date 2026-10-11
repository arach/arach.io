---
author: Arach Tchoupani
pubDatetime: 2026-10-11T12:00:00Z
title: "Infinite margins"
description: "A design note on Linea’s scoped reading canvas: infinite margins for notes, explicit reading context, and a Spring landing at exact page fit."
tags: [linea, design, reading]
noindex: true
publicationPending: true
article: true
readingTime: "6 min"
canonicalURL: "https://arach.io/posts/infinite-margins/"
---

I have been working on a canvas for Linea, the reader I am building. A small part of the interaction captures the idea: zoom back toward the page, and it catches at exactly the size where reading feels settled. This is the design note for the Linea blog, with a copy here.

Cross-posted from the Linea design note, [Infinite margins](https://lineareads.com/blog/infinite-margins). The implementation described here is in review, rather than a release announcement.


A difficult passage can ask for more space than the margin allows. A note grows past the paragraph. A diagram needs a third of a page. Another paper needs somewhere to sit beside the one you are reading.

Software has two usual answers. One is a notes panel beside the text, which is a list, and a list has no shape. The other is a whiteboard: put the document on an infinite canvas and arrange things around it. The whiteboard gets the space right and the reading wrong. The book becomes one card among many, and you end up reading it at whatever size the camera happens to be.

The design I settled on for Linea is a third answer. The reader stays a reader. It is also an object sitting on a canvas, and when you zoom out, the canvas is what you see around it. I call the result infinite margins, because that is what it should feel like: the same page, with the white space extended as far as you need.

## The page stays mounted

The first rule is that zooming out does not replace the reader with a picture of the reader. The live reading workspace stays where it is. Your selection, your narration session and your reading position survive the camera move in both directions.

The camera is also not a text-size control. Camera scale changes neither the typography nor a PDF's own zoom level. Those are separate settings and they stay put. The camera only answers one question: how far back are you standing?

In the margins you can place notes with editable text, draw freehand ink, and add links to research. A plain two-finger scroll pans the canvas with the trackpad's own momentum. A dragged canvas keeps moving after you let go and slows down on its own, and any new input takes over from wherever the canvas visibly is, not from where it was heading.

## The canvas belongs to something

An infinite canvas with no owner turns into a junk drawer. So every canvas in Linea has an explicit scope, and there are exactly four kinds: a page, a chapter, a book, or a set of books that you chose.

A few consequences follow from taking that seriously.

A page means a physical page of a PDF. Reflowed text has no stable pages, since a screenful changes with the window and the font, so text you are reading in reflow uses a chapter instead.

A set of books is a list you made. It is never the whole library by default, and it does not grow on its own. Linking a note to an outside source does not add that source to the set. Opening another document does not add it either.

A canvas has an identity that is separate from its label. You can rename a canvas without changing what it covers.

The last consequence is the one I care most about. If the source changes or goes missing, for example because a file is replaced and the chapter no longer matches, the canvas stays intact and is marked unresolved. Linea does not widen its scope, delete it or quietly attach it to something that looks similar. Notes you wrote against one text should not migrate to another because software guessed.

## Fit is a place to stop

Zoom on a normal canvas is continuous. Every scale is as valid as every other. That works for a whiteboard. For a reader it is wrong, because one scale is special: the one where the page fills the view exactly and you are simply reading. I call it fit. If zoom is continuous, fit is a point you fly past. You pinch back toward the page, overshoot, nudge out, and settle for something close. Nearly fit is worse than it sounds. The line length is slightly off and the edge of the canvas shows at one side. You are in neither place.

So fit is a detent. When you zoom inward over the page and cross 100%, the camera lands on exactly 100% with zero pan, and it stays there.

The staying is the important part. A trackpad keeps sending scroll events after your fingers stop, and a pinch rarely ends cleanly. Without a hold, that leftover input carries you through fit and into magnification. With the hold, any input that continues the same gesture is absorbed. The page stays at fit until the input has been quiet for 300 milliseconds. After that, a new gesture is a new intention: zoom in again and the page magnifies, up to 600%.

The rule is asymmetric on purpose. It applies only to an inward crossing over the page. Outward zoom has no gesture hold. Crossing from magnified reading back through fit can produce one exact-fit step, but the next outward input continues into the margins. The continuing-input hold belongs only to the return inward.

## How it lands

Once fit was a destination, the arrival needed a character. We compared four treatments side by side: Magnet, the original 230ms ease; Snap, a 140ms cut with no ceremony; Cushion, a 440ms soft catch; and Spring.

I chose Spring. The page travels slightly past fit, peaks at 101.2% about two thirds of the way through, and settles back to exactly 100%. The whole arrival takes 320 milliseconds.

The intent of the small rebound is to make the landing feel like a catch. It gives fit a physical character without making the page spend long away from its reading size.

The bounce is presentation only. The camera's real destination is exact fit the entire time, and that is what gets saved. The 300ms hold does not depend on the animation. If your system asks for reduced motion, there is no flight and no bounce: the page is at fit immediately.

<figure class="canvas-demo"><iframe src="/experiments/infinite-margins/index.html" title="Try Linea’s scoped reading margins and Spring fit landing" loading="lazy" width="100%" height="920"></iframe><figcaption>Try the explanatory demo. Buttons and keyboard controls are available alongside gestures. Sample notes remain in this tab only. <a href="/experiments/infinite-margins/index.html">Open the demo on its own</a>.</figcaption></figure>

## The canvas leaves when you read

At fit, the canvas controls are gone. The zoom controls, the overview map and the scope label fade out over 230 milliseconds and become inert, so they cannot take focus or a click. They return with the same timing when you zoom out.

This is the other half of the detent. If a "you are on a canvas" toolbar stayed on screen while you read, the page would still be a card on a board. With the controls gone, fit is just the reader, and the margins are there whenever you step back.

## What exists now

The canvas runs in Linea's browser reader and is in review. It has been checked against real EPUB and PDF documents in a browser. It has not been released, and it has not yet been signed off on a physical touchscreen, so I am not making claims about how the pinch feels on glass.

Canvases are stored locally in the browser. The data model is written to be portable, so the Mac app can consume the same model. Hosting the same surface on the Mac remains separate work. That work, along with syncing canvases to an account and letting an agent place things on a canvas, is still ahead.
