import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function PostCard({
  href,
  frontmatter,
  secHeading = true,
}: Props) {
  const { title, pubDatetime, modDatetime, description, thumbnail } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-xl font-bold line-clamp-2",
  };

  // Default thumbnail if none provided - using a gradient placeholder
  const thumbnailSrc = thumbnail?.src || null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-skin-card">
      {/* Gradient border effect */}
      <div className="absolute inset-0 rounded-2xl p-[1px] opacity-60 transition-opacity duration-300 group-hover:opacity-100">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-skin-accent/20 via-skin-accent/40 to-skin-accent/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-sm"></div>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-skin-accent/30 to-transparent"></div>
      </div>
      
      {/* Inner content with background */}
      <div className="relative flex flex-col overflow-hidden rounded-2xl border border-skin-line bg-skin-card transition-all duration-300 group-hover:border-skin-accent/20">
        <a href={href} className="absolute inset-0 z-10" aria-label={title}>
          <span className="sr-only">{title}</span>
        </a>

      {/* Polaroid-style Thumbnail */}
      <div className="p-4 bg-white dark:bg-gray-900/50">
        <div className="aspect-[16/9] w-full overflow-hidden bg-skin-card-muted shadow-inner rounded-sm">
          {thumbnailSrc ? (
            <img
              src={thumbnailSrc}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
                style={{ backgroundSize: "1000px 100%" }}
              ></div>
              <svg
                className="h-16 w-16 opacity-20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
        {/* Date */}
        <div className="mb-3 text-sm opacity-70">
          <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
        </div>

        {/* Title */}
        {secHeading ? (
          <h2 {...headerProps}>{title}</h2>
        ) : (
          <h3 {...headerProps}>{title}</h3>
        )}

        {/* Description */}
        {description && (
          <p className="mt-3 flex-1 text-sm leading-relaxed opacity-80 line-clamp-3">
            {description}
          </p>
        )}

        {/* Read more */}
        <div className="mt-4 flex items-center text-sm font-medium">
          <span className="text-skin-base/60 group-hover:text-skin-accent transition-colors duration-300">
            Read article →
          </span>
        </div>
      </div>
      </div>
    </article>
  );
}
