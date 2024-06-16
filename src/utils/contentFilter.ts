import { SITE } from "@config";
import type { CollectionEntry, ContentEntryMap } from "astro:content";

const contentFilter = <T extends keyof ContentEntryMap>({ data }: CollectionEntry<T>) => {
  const isPublishTimePassed =
    Date.now() >
    new Date(data.pubDatetime).getTime() - SITE.scheduledPostMargin;
  return !data.draft && (import.meta.env.DEV || isPublishTimePassed);
};

export default contentFilter;
