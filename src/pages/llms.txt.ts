import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { bio, projects, tech, accounts, sites } from "@data/agents";

export const GET: APIRoute = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  const sorted = posts.sort(
    (a, b) =>
      new Date(b.data.pubDatetime).getTime() -
      new Date(a.data.pubDatetime).getTime()
  );

  const lines: string[] = [];

  // Header per llms.txt spec
  lines.push(`# ${bio.name}`);
  lines.push("");
  lines.push(`> ${bio.summary}`);
  lines.push("");

  // Site info
  lines.push("This is the personal website of Arach Tchoupani — blog posts, projects, and writing about engineering, startups, and AI.");
  lines.push("");
  lines.push(`- Website: https://arach.io`);
  lines.push(`- Portfolio: https://arach.dev`);
  lines.push(`- RSS: https://arach.io/rss.xml`);
  lines.push(`- Agent profile: https://arach.io/agents`);
  lines.push(`- Agent data (JSON): https://arach.io/agents/index.json`);
  lines.push(`- Agent data (Markdown): https://arach.io/agent.md`);
  lines.push("");

  // Sections
  lines.push("## Blog Posts");
  lines.push("");
  for (const p of sorted) {
    const date = new Date(p.data.pubDatetime).toISOString().slice(0, 10);
    lines.push(`- [${p.data.title}](https://arach.io/posts/${p.slug}/): ${p.data.description || ""} (${date})`);
  }
  lines.push("");

  // Projects
  lines.push("## Projects");
  lines.push("");
  for (const p of projects) {
    const url = p.href ? ` (${p.href})` : "";
    lines.push(`- ${p.name}${url}: ${p.desc}`);
  }
  lines.push("");

  // Tech
  lines.push("## Tech Stack");
  lines.push("");
  for (const t of tech) {
    lines.push(`- ${t.k}: ${t.v}`);
  }
  lines.push("");

  // Contact
  lines.push("## Contact");
  lines.push("");
  for (const a of accounts) {
    lines.push(`- ${a.name}: ${a.href}`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
