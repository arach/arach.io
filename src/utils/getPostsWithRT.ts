import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

export const getReadingTime = async () => {
  // Get all posts and memos using separate glob patterns (including both .md and .mdx)
  const globBlogPosts = import.meta.glob("../content/blog/*.{md,mdx}");
  const globMemos = import.meta.glob("../content/memo/*.{md,mdx}");

  // Combine both glob results
  const allGlobs = { ...globBlogPosts, ...globMemos };

  // Set frontmatter values in a JS Map with key value pair
  const mapFrontmatter = new Map();
  const globValues = Object.values(allGlobs);
  await Promise.all(
    globValues.map(async globPost => {
      const { frontmatter } = await globPost();
      mapFrontmatter.set(
        slugifyStr(frontmatter.title),
        frontmatter.readingTime
      );
    })
  );

  return mapFrontmatter;
};

const getPostsWithRT = async (posts: CollectionEntry<"blog" | "memo">[]) => {
  const mapFrontmatter = await getReadingTime();
  return posts.map(post => {
    post.data.readingTime = mapFrontmatter.get(slugifyStr(post.data.title));
    return post;
  });
};

export default getPostsWithRT;
