import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";

export const GET: APIRoute = async ({ params }) => {
  const { slug, layout } = params;
  
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  // Get all posts
  const posts = await getCollection("blog");
  
  // Find the post that matches this slug
  const post = posts.find(p => slugifyStr(p.data.title) === slug);
  
  if (!post || post.data.draft) {
    return new Response("Not found", { status: 404 });
  }

  // Generate and return the OG image with layout override
  const image = await generateOgImageForPost(post, layout || undefined);
  
  return new Response(image, {
    headers: { 
      "Content-Type": "image/png",
      "Cache-Control": layout ? "no-cache" : "public, max-age=31536000, immutable"
    },
  });
};

// For production builds, pre-generate all the routes with all layouts
export async function getStaticPaths() {
  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft)
  );
  
  const layouts = ['40-60', 'ultrawide', 'ultracompact'];
  const paths = [];
  
  // Generate paths for each post with each layout
  for (const post of posts) {
    for (const layout of layouts) {
      paths.push({
        params: { 
          slug: slugifyStr(post.data.title),
          layout: layout
        },
      });
    }
  }

  return paths;
}