import type { APIRoute } from "astro";
import { bio, career, projects, agents, tech, accounts, sites } from "@data/agents";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify({ bio, career, projects, agents, tech, accounts, sites }, null, 2),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    }
  );
