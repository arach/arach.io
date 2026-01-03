import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { generateOgImageForTIL } from "@utils/generateOgImages";

export const GET: APIRoute = async (context) => {
  const { slug } = context.params;

  if (!slug) {
    return new Response("Not found", { status: 404 });
  }

  const tils = await getCollection("til");
  const til = tils.find(t => t.slug === slug);

  if (!til || til.data.draft) {
    return new Response("Not found", { status: 404 });
  }

  const image = await generateOgImageForTIL(til);

  return new Response(image, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable"
    },
  });
};

export async function getStaticPaths() {
  const tils = await getCollection("til").then(t =>
    t.filter(({ data }) => !data.draft)
  );

  return tils.map(til => ({
    params: { slug: til.slug },
  }));
}
