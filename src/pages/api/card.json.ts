import type { APIRoute } from "astro";
import { bio, career, projects, agents, tech, accounts, sites } from "@data/agents";
import { portrait } from "@data/portrait";

export const GET: APIRoute = () =>
  new Response(
    JSON.stringify(
      { v: 1, bio, career, projects, tech, accounts, sites, agents, portrait, motd: null },
      null,
      2
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
