import { createClient, type Client } from "@libsql/client";

let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    db = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
    });
  }
  return db;
}

export async function initDb(): Promise<void> {
  const client = getDb();

  await client.batch([
    `CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      agent_name TEXT NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT DEFAULT (datetime('now')),
      revoked_at TEXT
    )`,
    `CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      token_id TEXT NOT NULL REFERENCES tokens(id),
      agent_name TEXT NOT NULL,
      body TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )`,
    `CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      agent_name TEXT NOT NULL,
      body TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      read_at TEXT
    )`,
  ]);

  // Migration: add read_at to existing replies table
  try {
    await client.execute(
      `ALTER TABLE replies ADD COLUMN read_at TEXT`
    );
  } catch {
    // Column already exists — ignore
  }
}
