import type { MarkdownInstance } from "astro";
import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "./slugify";

// Generalized function to get reading time for any content type
export const getReadingTime = async (contentType: 'blog' | 'book') => {
    // Adjust the file path based on the content type
    const filePath = contentType === 'blog' ? "../content/blog/*.md" : "../content/books/*.md";
    let globContent: Promise<CollectionEntry<"blog">["data"][]>;

    if (contentType == "blog") {
        globContent = import.meta.glob("../content/blog/*.md") as Promise<
            CollectionEntry<"blog">["data"][]
        >;
    } else {
        globContent = import.meta.glob("../content/book/*.md") as Promise<
            CollectionEntry<"book">["data"][]
        >;
    }

    const globContentValues = await Promise.all(
        Object.values(globContent).map(async (contentFunc) => await contentFunc())
    );

    const mapFrontmatter = new Map();
    const globValues = Object.values(globContent);
    await Promise.all(
        globValues.map(async globContent => {
            console.log("globContent: ", globContent);
            const { frontmatter } = await globContent();
            console.log("readingTime: ", frontmatter.readingTime);
            mapFrontmatter.set(
                slugifyStr(frontmatter.title),
                frontmatter.readingTime
            );
        })
    );

    return mapFrontmatter;

};

// Generalized function to get posts or books with reading time
const getContentWithRT = async (contentType: 'blog' | 'book', contents: CollectionEntry<typeof contentType>[]) => {
    const mapFrontmatter = await getReadingTime(contentType);
    return contents.map(content => {
        content.data.readingTime = mapFrontmatter.get(slugifyStr(content.data.title));
        return content;
    });
};

export default getContentWithRT;
