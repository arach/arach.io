import type { CollectionEntry, DataEntryMap } from "astro:content";
import contentFilter from "./contentFilter";

// Make the function generic with a type parameter T that is a key of DataEntryMap
const getSortedContent = <T extends keyof DataEntryMap>(
  items: CollectionEntry<T>[]
) => {
  return items
    .filter(contentFilter)
    .sort(
      (a, b) =>
        Math.floor(
          new Date(b.data.modDatetime ?? b.data.pubDatetime).getTime() / 1000
        ) -
        Math.floor(
          new Date(a.data.modDatetime ?? a.data.pubDatetime).getTime() / 1000
        )
    );
};

export default getSortedContent;
