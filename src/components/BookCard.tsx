import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import type { CollectionEntry } from "astro:content";
import StarRating from "@components/StarRating";

export interface Props {
  href?: string;
  frontmatter: CollectionEntry<"book">["data"];
  secHeading?: boolean;
}

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const { title, pubDatetime, modDatetime, description, thumbnail, rating } =
    frontmatter;

  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <li className="my-6 flex flex-row">
      <div className="flex-1">
        <a
          href={href}
          className="inline-block text-lg font-medium text-skin-accent decoration-dashed underline-offset-4 focus-visible:no-underline focus-visible:underline-offset-0"
        >
          {secHeading ? (
            <h2 {...headerProps}>{title}</h2>
          ) : (
            <h3 {...headerProps}>{title}</h3>
          )}
        </a>
        <div className="flex flex-row items-center space-x-4">
          <Datetime pubDatetime={pubDatetime} modDatetime={modDatetime} />
          {rating !== undefined && <StarRating rating={rating} />}
        </div>
        <div>
          <div className="flex-1">
            <p>{description}</p>
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
