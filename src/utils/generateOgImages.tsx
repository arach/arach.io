import satori, { type SatoriOptions } from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFile } from "node:fs/promises";
import { type CollectionEntry } from "astro:content";
import fs from "node:fs/promises";
import { join } from "node:path";

import postOgImage from "./og-templates/post";
import siteOgImage from "./og-templates/site";
import path from "path";

// Use Space Mono fonts for tactical look
const fontRegularPath = path.resolve(
  "public/fonts/Space_Mono/SpaceMono-Regular.ttf"
);
const fontBoldPath = path.resolve(
  "public/fonts/Space_Mono/SpaceMono-Bold.ttf"
);

const fontRegular = await readFile(fontRegularPath);
const fontBold = await readFile(fontBoldPath);

const options: SatoriOptions = {
  width: 1200,
  height: 630,
  fonts: [
    {
      name: "Space Mono",
      weight: 400,
      data: fontRegular,
      style: "normal",
    },
    {
      name: "Space Mono",
      data: fontBold,
      weight: 700,
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
        if (post.data.thumbnail.startsWith("http://") || post.data.thumbnail.startsWith("https://")) {
          // External URL - fetch and convert to base64
          try {
            const response = await fetch(post.data.thumbnail);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const ext = path.extname(new URL(post.data.thumbnail).pathname).toLowerCase();
            const mimeType = ext === '.png' ? 'image/png' :
                            ext === '.webp' ? 'image/webp' : 'image/jpeg';
            thumbnailBase64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
            return; // Skip the file reading below
          } catch (err) {
            console.warn(`Could not fetch external thumbnail from ${post.data.thumbnail}:`, err);
            return; // Skip the file reading below
          }
        } else if (post.data.thumbnail.startsWith("../../assets/")) {
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
