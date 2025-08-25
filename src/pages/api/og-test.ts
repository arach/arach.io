import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImageForPost } from "@utils/generateOgImages";
import { slugifyStr } from "@utils/slugify";

export const GET: APIRoute = async ({ url }) => {
  // Get parameters from URL
  const slug = url.searchParams.get('slug');
  const layout = url.searchParams.get('layout');
  
  if (!slug) {
    return new Response("Missing slug parameter", { status: 400 });
  }

  // Get all posts
  const posts = await getCollection("blog");
  
  // Find the post that matches this slug
  const post = posts.find(p => slugifyStr(p.data.title) === slug || p.slug === slug);
  
  if (!post || post.data.draft) {
    return new Response("Post not found", { status: 404 });
  }

  console.log('OG Test API - slug:', slug, 'layout:', layout);

  // Generate and return the OG image with layout override
  const image = await generateOgImageForPost(post, layout || undefined);
  
  return new Response(image, {
    headers: { 
      "Content-Type": "image/png",
      "Cache-Control": "no-cache"
    },
  });
};