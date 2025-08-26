import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";

export const GET: APIRoute = async (context) => {
  const { slug } = context.params;
  
  if (!slug) {
    return new Response("Not found", { status: 404 });
  }
  
  // Get layout from URL param if provided  
  const layoutParam = context.url?.searchParams?.get('layout') || null;

  // Get all posts
  const posts = await getCollection("blog");
  
  // Find the post that matches this slug - use the actual post.slug, not slugified title
  const post = posts.find(p => p.slug === slug);
  
  if (!post || post.data.draft) {
    return new Response("Not found", { status: 404 });
  }

  // Generate and return the OG image with optional layout override
  const image = await generateOgImageForPost(post, layoutParam as any);
  
  return new Response(image, {
    headers: { 
      "Content-Type": "image/png",
      "Cache-Control": layoutParam ? "no-cache" : "public, max-age=31536000, immutable"
    },
  });
};

// For production builds, pre-generate all the routes
export async function getStaticPaths() {
  const posts = await getCollection("blog").then(p =>
    p.filter(({ data }) => !data.draft)
  );

  return posts.map(post => ({
    params: { slug: post.slug },
  }));
}