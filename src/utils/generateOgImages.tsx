import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { type CollectionEntry } from "astro:content";

import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import path from "path";

// const fontRegularPath = path.resolve("public/fonts/FiraSans/FiraSans-Black.ttf");
// const fontBoldPath = path.resolve("public/fonts/FiraSans/FiraSans-Bold.ttf");

const fontRegularPath = path.resolve(
  "public/fonts/Fira_Mono/FiraMono-Regular.ttf"
);
const fontBoldPath = path.resolve("public/fonts/Fira_Mono/FiraMono-Bold.ttf");

const fontRegular = await readFile(fontRegularPath);
const fontBold = await readFile(fontBoldPath);

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Inter",
      weight: 400,
      data: fontRegular,
      style: "normal",
    },
    {
      name: "Inter",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">) {
  const svg = await satori(postOgImage(post), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
