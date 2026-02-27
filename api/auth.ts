import { createMiddleware } from "hono/factory";
import { getDb } from "./db";

type AgentContext = {
  agent: { id: string; name: string };
};

async function hashToken(token: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(token);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const tokenAuth = createMiddleware<{ Variables: AgentContext }>(
  async (c, next) => {
    const header = c.req.header("Authorization");
    if (!header?.startsWith("Bearer ")) {
      return c.json({ error: "Missing or invalid Authorization header" }, 401);
    }

    const token = header.slice(7);
    const hash = await hashToken(token);
    const db = getDb();

    const result = await db.execute({
      sql: "SELECT id, agent_name, revoked_at FROM tokens WHERE token_hash = ?",
      args: [hash],
    });

    if (result.rows.length === 0) {
      return c.json({ error: "Invalid token" }, 401);
    }

    const row = result.rows[0];
    if (row.revoked_at) {
      return c.json({ error: "Token has been revoked" }, 401);
    }

    c.set("agent", {
      id: row.id as string,
      name: row.agent_name as string,
    });

    await next();
  }
);

export const adminAuth = createMiddleware(async (c, next) => {
  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Missing or invalid Authorization header" }, 401);
  }

  const token = header.slice(7);
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken || token !== adminToken) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  await next();
});

export { hashToken };
