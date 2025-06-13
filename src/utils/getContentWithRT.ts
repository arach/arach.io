import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

type ContentType = "blog" | "book" | "memo";

const globPatterns = {
  blog: import.meta.glob("../content/blog/*.md", { eager: true }),
  book: import.meta.glob("../content/book/*.md", { eager: true }),
  memo: import.meta.glob("../content/memo/*.md", { eager: true }),
} as const;

export const getReadingTime = async (contentType: ContentType) => {
  const globContent = globPatterns[contentType] as Record<
    string,
    { default: CollectionEntry<typeof contentType> }
  >;

  const mapFrontmatter = new Map();
  Object.values(globContent).forEach(content => {
    mapFrontmatter.set(
      slugifyStr(content.frontmatter.title),
      content.frontmatter.readingTime
    );
  });

  return mapFrontmatter;
};

const getContentWithRT = async <T extends ContentType>(
  contentType: T,
  contents: CollectionEntry<T>[]
) => {
  const mapFrontmatter = await getReadingTime(contentType);
  return contents.map(content => ({
    ...content,
    data: {
      ...content.data,
      readingTime: mapFrontmatter.get(slugifyStr(content.data.title)),
    },
  })) as CollectionEntry<T>[];
};

export default getContentWithRT;
