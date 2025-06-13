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
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-skin-line bg-skin-card transition-all duration-300 hover:border-skin-accent/30 hover:shadow-lg hover:-translate-y-1">
      <a href={href} className="absolute inset-0 z-10" aria-label={title}>
        <span className="sr-only">{title}</span>
      </a>

      {/* Thumbnail */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-skin-card-muted">
        {thumbnailSrc ? (
          <img
            src={thumbnailSrc}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-skin-card-muted to-skin-card flex items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"
              style={{ backgroundSize: "1000px 100%" }}
            ></div>
            <svg
              className="h-16 w-16 opacity-30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-6">
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
          <span className="text-skin-base/60 group-hover:text-skin-base transition-colors">
            Read article →
          </span>
        </div>
      </div>
    </article>
  );
}
