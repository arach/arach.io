import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { type CollectionEntry } from "astro:content";
import fs from "node:fs/promises";
import { join } from "node:path";

import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import path from "path";

// Use Geist fonts for a modern look
const fontRegularPath = path.resolve(
  "public/fonts/Geist-1.3.0/statics-ttf/Geist-Regular.ttf"
);
const fontBoldPath = path.resolve(
  "public/fonts/Geist-1.3.0/statics-ttf/Geist-Bold.ttf"
);
const fontBlackPath = path.resolve(
  "public/fonts/Geist-1.3.0/statics-ttf/Geist-Black.ttf"
);

const fontRegular = await readFile(fontRegularPath);
const fontBold = await readFile(fontBoldPath);
const fontBlack = await readFile(fontBlackPath);

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Geist",
      weight: 400,
      data: fontRegular,
      style: "normal",
    },
    {
      name: "Geist",
      data: fontBold,
      weight: 600,
      style: "normal",
    },
    {
      name: "Geist",
      data: fontBlack,
      weight: 800,
      style: "normal",
    },
  ],
};

function svgBufferToPngBuffer(svg: string) {
  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  return pngData.asPng();
}

export async function generateOgImageForPost(post: CollectionEntry<"blog">, layoutOverride?: string) {
  // Try to load thumbnail as base64 if it exists
  let thumbnailBase64: string | undefined;
  
  if (post.data.thumbnail) {
    try {
      // The thumbnail path in frontmatter is like "../../assets/images/infinite-paste-machine.png"
      // We need to resolve this relative to the blog post location
      let imagePath: string;
      
      if (typeof post.data.thumbnail === 'string') {
        // String path in frontmatter
        if (post.data.thumbnail.startsWith("../../assets/")) {
          // Convert relative path to absolute
          imagePath = join(process.cwd(), "src", "assets", post.data.thumbnail.replace("../../assets/", ""));
        } else if (post.data.thumbnail.startsWith("/src/assets/")) {
          // Already has /src/assets prefix
          imagePath = join(process.cwd(), post.data.thumbnail.substring(1));
        } else {
          imagePath = post.data.thumbnail;
        }
      } else if (post.data.thumbnail?.fsPath) {
        // Image metadata object with fsPath
        imagePath = post.data.thumbnail.fsPath;
      } else {
        // Try to use src if available (processed path)
        imagePath = post.data.thumbnail?.src || "";
      }
      
      // Try to read the image file
      try {
        const imageBuffer = await fs.readFile(imagePath);
        const ext = path.extname(imagePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 
                        ext === '.webp' ? 'image/webp' : 'image/jpeg';
        thumbnailBase64 = `data:${mimeType};base64,${imageBuffer.toString('base64')}`;
      } catch (err) {
        console.warn(`Could not read thumbnail file at ${imagePath}:`, err);
      }
    } catch (err) {
      console.warn("Error processing thumbnail:", err);
    }
  }
  
  const svg = await satori(postOgImage(post, thumbnailBase64, layoutOverride), options);
  return svgBufferToPngBuffer(svg);
}

export async function generateOgImageForSite() {
  const svg = await satori(siteOgImage(), options);
  return svgBufferToPngBuffer(svg);
}
