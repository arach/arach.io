import type { APIRoute } from "astro";
import { bio, career, projects, agents, tech, accounts, sites } from "@data/agents";

function render(): string {
  const lines: string[] = [];

  lines.push(`# ${bio.name}`);
  lines.push("");
  lines.push(`> ${bio.summary}`);
  lines.push("");
  lines.push(`**Location:** ${bio.location}`);
  lines.push("");
  lines.push(`| Years | Ventures | Exit | Raised |`);
  lines.push(`|-------|----------|------|--------|`);
  lines.push(`| ${bio.stats.years} | ${bio.stats.ventures} | ${bio.stats.exit} | ${bio.stats.raised} |`);
  lines.push("");

  lines.push("## Career");
  lines.push("");
  for (const c of career) {
    lines.push(`- ${c}`);
  }
  lines.push("");

  lines.push("## Agents");
  lines.push("");
  for (const a of agents) {
    lines.push(`- [${a.name}](${a.href}) — ${a.desc}`);
  }
  lines.push("");

  lines.push("## Projects");
  lines.push("");
  for (const p of projects) {
    const link = p.href ? `[${p.name}](${p.href})` : `**${p.name}**`;
    lines.push(`### ${link}`);
    lines.push("");
    lines.push(p.desc);
    lines.push("");
    lines.push(`\`${p.stack}\``);
    lines.push("");
  }
  lines.push("*15+ projects at [arach.dev](https://arach.dev)*");
  lines.push("");

  lines.push("## Stack");
  lines.push("");
  lines.push("| Area | Technologies |");
  lines.push("|------|-------------|");
  for (const t of tech) {
    lines.push(`| ${t.k} | ${t.v} |`);
  }
  lines.push("");

  lines.push("## Accounts");
  lines.push("");
  for (const a of accounts) {
    lines.push(`- **${a.name}**: [${a.handle}](${a.href})`);
  }
  lines.push("");

  lines.push("## Sites");
  lines.push("");
  for (const s of sites) {
    lines.push(`- [${s.name}](${s.href}) — ${s.desc}`);
  }
  lines.push("");

  return lines.join("\n");
}

export const GET: APIRoute = () =>
  new Response(render(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
