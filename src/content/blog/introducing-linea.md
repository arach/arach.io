---
author: Arach Tchoupani
pubDatetime: 2026-10-11T12:00:00Z
title: "Introducing Linea"
description: "The reading app I’m building for difficult material: read, listen, and ask about a passage while keeping the source and your place together."
tags: [linea, reading, design, AI]
publicationPending: true
article: true
readingTime: "5 min"
canonicalURL: "https://arach.io/posts/introducing-linea/"
---

I'm building Linea, a reading app for understanding difficult material. Bring in a paper, a book, or an article. Read it, listen to it, and ask about the part that doesn't make sense yet. Keep your place through all of it.

That last part is the product for me. The source, the question, and the answer should stay close enough that you can move between them without reconstructing what you were doing.

A paragraph can be perfectly legible and still take twenty minutes to understand. You read it again. You look up a term. You draw a relationship between two ideas. You ask someone what the author is assuming. Then you return to the paragraph and it reads differently.

I want Linea to make room for that kind of reading.

## Read, listen, ask

The basic loop is already working.

Import a document and read it with the typography set the way you like. For a PDF, you can keep the original page, read the extracted text, or put the two beside each other. The original matters: an equation, a figure, or the layout of a page can carry something that plain text loses.

Start listening and the spoken sentence is highlighted in the reader. You can follow the voice, skim ahead, or stop following and inspect something else. There is a way back to the passage being read.

Then select a passage and ask a question. What does this term mean here? What assumption connects these two claims? Can you explain this sentence more simply?

On the Mac, the passage stays pinned above the conversation beside the text. Follow-up questions continue there, and the question remains attached to the document so you can return to it later. You can ask while listening, with the answer arriving without throwing away the playback context.

The useful detail is the word *here*. “What is entropy?” and “What does entropy mean in this paragraph?” are different questions. Linea gives the question a place in the text. The answer is something you can compare with the author's words.

AI can get an explanation wrong. Keeping the source visible gives you something to inspect when that happens. It also makes a good answer more useful: you can see exactly which part has become clearer.

## Start with what you are reading

Linea accepts PDFs, DRM-free ebooks, Word documents, Markdown, and other supported text formats. The native apps can also bring in web articles, images, and scans. The [import guide](https://lineareads.com/docs/importing) spells out the differences between the apps and the browser.

That variety matters because the interesting material rarely arrives in one tidy format. A paper has columns. A book has chapters. A scan has a page image that you may need to check against the recognized text.

I want those documents to arrive in the same reading loop while keeping the parts that matter about their source. Original PDF pages stay available beside readable text. Notes and questions attach to passages. The place you return to should belong to the document, rather than whichever window size happened to be on screen.

Some of the work is unglamorous. Reading order, extraction, chapter boundaries, and returning to the right passage all affect whether the reader feels dependable. A beautiful explanation beside the wrong paragraph is still wrong.

## Quiet, with room to think

The visual direction is quiet: good type, paper, ink, and controls close to the thing they affect. I want the interface to have a little personality without demanding attention from every corner.

The newer Four Lines treatment puts the reader's controls at its edges. The browser version is in review, along with a canvas that opens around the live reading workspace. Zoom out and there is room for a note, a drawing, or a research link. Return to page fit and the canvas controls disappear.

I like what that does to the relationship between reading and thinking. You can stay with one passage, then step back far enough to work around it.

The canvas belongs to a particular reading context: a page, a chapter, a book, or a set of books you deliberately choose. A diagram about one chapter has somewhere to live. Opening another book does not silently turn it into a board for your entire library.

There is a small Spring landing when you return to page fit. I wrote a separate [design note on infinite margins](/posts/infinite-margins/) with an interactive demo, because that interaction deserves its own explanation. The larger idea is that the reader should give you space when you need it, then settle back into reading.

## Where it stands

Read, listen, and passage-based questions are working parts of Linea. The [site](https://lineareads.com/) has the current ways to try it, and the [docs](https://lineareads.com/docs) explain the reading views, formats, and provider setup. Cloud voice and AI features have their own access requirements and costs.

The new browser canvas is still in review. Its notes, ink, and camera positions are stored locally in the browser. Bringing that canvas into the native app, syncing canvas work to an account, and letting an agent edit it are separate work ahead.

I'm introducing Linea now because the product has a clear shape: a place to stay with something until you understand it. Sometimes that means hearing the paragraph. Sometimes it means asking a question or drawing in the margin. I want those to feel like natural moves within the same read.
