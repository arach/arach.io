import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono();

app.get("/*", (c) => {
  return c.json({ ok: true, path: c.req.path, timestamp: new Date().toISOString() });
});

export default handle(app);
