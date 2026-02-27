import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { bio, career, projects, tech, accounts, sites } from "@data/agents";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) =>
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime()
  );

  const featured = sorted.filter(p => p.data.featured);
  const recent = sorted.filter(p => !p.data.featured);

  const lines: string[] = [];

  // Intro
  lines.push(`# ${bio.name}`);
  lines.push("");
  lines.push(`> ${bio.summary}`);
  lines.push("");
  lines.push(`Location: ${bio.location}`);
  lines.push("");

  // Featured posts
  if (featured.length > 0) {
    lines.push("## Featured Posts");
    lines.push("");
    for (const p of featured) {
      const date = new Date(p.data.pubDatetime).toISOString().slice(0, 10);
      lines.push(`- [${p.data.title}](https://arach.io/posts/${p.slug}/) — ${date}`);
      if (p.data.description) {
        lines.push(`  ${p.data.description}`);
      }
    }
    lines.push("");
  }

  // Recent posts
  if (recent.length > 0) {
    lines.push("## Recent Posts");
    lines.push("");
    for (const p of recent) {
      const date = new Date(p.data.pubDatetime).toISOString().slice(0, 10);
      lines.push(`- [${p.data.title}](https://arach.io/posts/${p.slug}/) — ${date}`);
      if (p.data.description) {
        lines.push(`  ${p.data.description}`);
      }
    }
    lines.push("");
  }

  // Projects
  lines.push("## Projects");
  lines.push("");
  for (const p of projects) {
    const link = p.href ? `[${p.name}](${p.href})` : p.name;
    lines.push(`- ${link} — ${p.desc}`);
  }
  lines.push("");

  // Links
  lines.push("## Links");
  lines.push("");
  for (const s of sites) {
    lines.push(`- [${s.name}](${s.href}) — ${s.desc}`);
  }
  lines.push("");
  for (const a of accounts) {
    lines.push(`- ${a.name}: [${a.handle}](${a.href})`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
