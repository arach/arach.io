import fs from "fs/promises";
import path from "path";
import process from "process";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { SITE } from "../../src/config";

const BLOG_POSTS_DIRECTORY = path.join(__dirname, "../../pages/blog");

function generateMarkdown(
  title,
  pubDatetime,
  author,
  description,
  tags,
  excerpt,
  thumbnail,
  categories,
  featured,
  draft
) {
  return `---
title: "${title}"
pubDatetime: "${pubDatetime}"
author: "${author}"
layout: ../../layouts/BlogPost.astro
tags: [${tags.join(", ")}]
excerpt: "${excerpt}"
thumbnail: "${thumbnail}"
categories: [${categories.join(", ")}]
featured: ${featured}
draft: ${draft}
---

# ${title}

${description}

Enter your blog post content here...
`;
}

function formatFileName(title, date) {
  return `${date}-${title.toLowerCase().replace(/\s+/g, "-")}.md`;
}

async function createBlogPost(
  title,
  author,
  description,
  tags,
  excerpt,
  thumbnail,
  categories
) {
  try {
    const date = new Date().toISOString().split("T")[0];
    const fileName = formatFileName(title, date);
    const filePath = path.join(BLOG_POSTS_DIRECTORY, fileName);
    const content = generateMarkdown(
      title,
      date,
      author,
      description,
      tags,
      excerpt,
      thumbnail,
      categories,
      false,
      true
    );

    await fs.writeFile(filePath, content);
    console.log(`Blog post created successfully: ${filePath}`);
  } catch (err) {
    console.error("Error writing the blog post:", err);
  }
}

async function parseArguments() {
  const argv = await yargs(hideBin(process.argv))
    .option("title", {
      describe: "Title of the blog post",
      type: "string",
      demandOption: true,
    })
    .option("description", {
      describe: "Description of the blog post",
      type: "string",
      default: "",
    })
    .option("tags", {
      describe: "Comma-separated list of tags for the blog post",
      type: "array",
      default: ["general"],
    })
    .option("excerpt", {
      describe: "Excerpt for the blog post",
      type: "string",
      default: "",
    })
    .option("thumbnail", {
      describe: "Thumbnail image for the blog post",
      type: "string",
      default: "/path/to/default/thumbnail.jpg",
    })
    .option("categories", {
      describe: "Comma-separated list of categories for the blog post",
      type: "array",
      default: ["General"],
    })
    .help()
    .alias("help", "h")
    .parse();

  if (!argv.description) {
    argv.description = argv.title; // Default description to title if not provided
  }

  argv.author = SITE.author; // Use author from config

  return argv;
}

async function main() {
  const { title, author, description, tags, excerpt, thumbnail, categories } =
    await parseArguments();
  await createBlogPost(
    title,
    author,
    description,
    tags,
    excerpt,
    thumbnail,
    categories
  );
}

main();
