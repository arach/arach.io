#!/usr/bin/env node

import fs from "fs";
import path from "path";
import process from "process";

function createPost(title, content) {
  const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
  const fileName = `${date}-${slug}.md`;
  const filePath = path.join(__dirname, "../src/pages/blog", fileName);
  const data = `---
layout: post
title: ${title}
date: ${date}
---

${content}
`;

  fs.writeFileSync(filePath, data, "utf8");
  console.log(`Post created: ${filePath}`);
}

const [, , title, ...content] = process.argv;

if (!title || content.length === 0) {
  console.error("Usage: cli <title> <content>");
  process.exit(1);
}

createPost(title, content.join(" "));
