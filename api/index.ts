import type { IncomingMessage, ServerResponse } from "node:http";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { getDb, initDb } from "./_db.js";
import { tokenAuth, adminAuth, hashToken } from "./_auth.js";

type AgentContext = {
  Variables: {
    agent: { id: string; name: string };
  };
};

const app = new Hono<AgentContext>().basePath("/api/v1");

app.use("*", cors());

// Health check — no auth, no DB
app.get("/ping", (c) => {
  return c.json({ ok: true, timestamp: new Date().toISOString() });
});

// Lazy DB init for all other routes
let dbInitialized = false;
app.use("*", async (_c, next) => {
  if (!dbInitialized) {
    await initDb();
    dbInitialized = true;
  }
  await next();
});

// Send a message — token auth
app.post("/message", tokenAuth, async (c) => {
  const agent = c.get("agent");
  const body = await c.req.json<{
    body: string;
    metadata?: Record<string, unknown>;
  }>();

  if (!body.body || typeof body.body !== "string") {
    return c.json({ error: "body is required and must be a string" }, 400);
  }

  const id = crypto.randomUUID();
  const db = getDb();

  await db.execute({
    sql: `INSERT INTO messages (id, token_id, agent_name, body, metadata) VALUES (?, ?, ?, ?, ?)`,
    args: [
      id,
      agent.id,
      agent.name,
      body.body,
      body.metadata ? JSON.stringify(body.metadata) : null,
    ],
  });

  return c.json({ id, agent_name: agent.name, created_at: new Date().toISOString() }, 201);
});

// List messages — admin auth
app.get("/messages", adminAuth, async (c) => {
  const limit = Math.min(Number(c.req.query("limit")) || 50, 100);
  const offset = Number(c.req.query("offset")) || 0;
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT id, token_id, agent_name, body, metadata, created_at
          FROM messages ORDER BY created_at DESC LIMIT ? OFFSET ?`,
    args: [limit, offset],
  });

  const messages = result.rows.map((row) => ({
    id: row.id,
    token_id: row.token_id,
    agent_name: row.agent_name,
    body: row.body,
    metadata: row.metadata ? JSON.parse(row.metadata as string) : null,
    created_at: row.created_at,
  }));

  return c.json({ messages, limit, offset });
});

// Generate a new agent token — admin auth
app.post("/tokens", adminAuth, async (c) => {
  const { agent_name } = await c.req.json<{ agent_name: string }>();

  if (!agent_name || typeof agent_name !== "string") {
    return c.json({ error: "agent_name is required" }, 400);
  }

  const id = crypto.randomUUID();
  const rawToken = crypto.randomUUID();
  const hash = await hashToken(rawToken);
  const db = getDb();

  await db.execute({
    sql: `INSERT INTO tokens (id, agent_name, token_hash) VALUES (?, ?, ?)`,
    args: [id, agent_name, hash],
  });

  // Return the raw token only once — it cannot be retrieved again
  return c.json(
    {
      id,
      agent_name,
      token: rawToken,
      created_at: new Date().toISOString(),
    },
    201
  );
});

// List tokens — admin auth (metadata only, no hashes)
app.get("/tokens", adminAuth, async (c) => {
  const db = getDb();
  const result = await db.execute(
    `SELECT id, agent_name, created_at, revoked_at FROM tokens ORDER BY created_at DESC`
  );

  const tokens = result.rows.map((row) => ({
    id: row.id,
    agent_name: row.agent_name,
    created_at: row.created_at,
    revoked_at: row.revoked_at,
  }));

  return c.json({ tokens });
});

// Revoke a token — admin auth
app.delete("/tokens/:id", adminAuth, async (c) => {
  const tokenId = c.req.param("id");
  const db = getDb();

  const result = await db.execute({
    sql: `UPDATE tokens SET revoked_at = datetime('now') WHERE id = ? AND revoked_at IS NULL`,
    args: [tokenId],
  });

  if (result.rowsAffected === 0) {
    return c.json({ error: "Token not found or already revoked" }, 404);
  }

  return c.json({ id: tokenId, revoked: true });
});

// Convert Node.js req/res to fetch Request, pass to Hono, write back
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const proto = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host || "localhost";
  const url = new URL(req.url || "/", `${proto}://${host}`);

  // Read body for non-GET/HEAD
  let body: BodyInit | undefined;
  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    body = Buffer.concat(chunks);
  }

  const request = new Request(url.toString(), {
    method: req.method,
    headers: Object.entries(req.headers).reduce(
      (h, [k, v]) => {
        if (v) h[k] = Array.isArray(v) ? v.join(", ") : v;
        return h;
      },
      {} as Record<string, string>
    ),
    body,
  });

  const response = await app.fetch(request);

  res.writeHead(response.status, Object.fromEntries(response.headers.entries()));
  const buf = await response.arrayBuffer();
  res.end(Buffer.from(buf));
}
