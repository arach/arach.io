import type { CollectionEntry } from "astro:content";

// Sort books: by sortOrder (if set), then by pubDatetime (newest first)
const getSortedBooks = (books: CollectionEntry<"book">[]) =>
  books
    .filter(book => !book.data.draft)
    .sort((a, b) => {
      if (a.data.sortOrder !== undefined && b.data.sortOrder !== undefined) {
        return a.data.sortOrder - b.data.sortOrder;
      }
      if (a.data.sortOrder !== undefined) return -1;
      if (b.data.sortOrder !== undefined) return 1;
      return (
        new Date(b.data.pubDatetime).getTime() -
        new Date(a.data.pubDatetime).getTime()
      );
    });

export default getSortedBooks;
