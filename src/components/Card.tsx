import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"blog">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description, thumbnail } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-semibold decoration-dashed hover:underline",
  };

  return (
    <li className="my-8 flex flex-row">
      <div className="flex-1">
        <div className="flex flex-row">
          <div className="flex-2">
            <a
              href={href}
              className="inline-block text-base font-semibold text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0 mr-2"
            >
              {secHeading ? (
                <h2 {...headerProps}>{title}</h2>
              ) : (
                <h3 {...headerProps}>{title}</h3>
              )}
            </a>
          </div>
        </div>
        <div className="flex-1 text-sm opacity-70">
          <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
        </div>
        <div>
          <div className="flex-1 description mt-2">
            <p className="text-sm leading-relaxed text-skin-card opacity-90">
              {description}
            </p>
          </div>
        </div>
      </div>
      {thumbnail && (
        <div className="item-end px-2 ">
          <img
            data-card-thumbnail={true}
            src={thumbnail.src}
            alt={title}
            height={100}
            width={140}
          />
        </div>
      )}
    </li>
  );
}
