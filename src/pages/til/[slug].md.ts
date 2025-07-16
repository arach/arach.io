import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ params }) => {
  const { slug } = params;
  
  const tils = await getCollection('til');
  const til = tils.find(t => t.slug === slug);
  
  if (!til) {
    return new Response('Not found', { status: 404 });
  }
  
  // Build frontmatter
  const frontmatter = ['---'];
  Object.entries(til.data).forEach(([key, value]) => {
    if (key === 'pubDatetime' || key === 'modDatetime') {
      frontmatter.push(`${key}: ${value?.toISOString() || ''}`);
    } else if (Array.isArray(value)) {
      frontmatter.push(`${key}:`);
      value.forEach(item => frontmatter.push(`  - ${item}`));
    } else if (typeof value !== 'object' || value === null) {
      frontmatter.push(`${key}: ${value}`);
    }
  });
  frontmatter.push('---');
  
  const content = `${frontmatter.join('\n')}\n\n${til.body}`;
  
  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600'
    }
  });
};

export async function getStaticPaths() {
  const tils = await getCollection('til');
  return tils.map(til => ({
    params: { slug: til.slug }
  }));
}