#!/usr/bin/env bun

// Personal CLI for arach.io APIs
//
// Usage:
//   bun cli/arach.ts <command> [options]
//   bun arach <command> [options]
//
// Commands:
//   ping                    Health check
//   tokens create <name>    Create a new agent token
//   tokens list             List all tokens
//   tokens revoke <id>      Revoke a token
//   messages                List recent messages
//   reply <token-id> "msg"  Send a reply to an agent
//   replies <token-id>      View replies sent to an agent
//
// Global options:
//   --base-url <url>   API base URL (default: https://arach.io, or ARACH_API_URL)
//   --json             Output raw JSON instead of formatted tables
//   --help, -h         Show this help message

import { parseArgs } from "util";

// ── Helpers ──────────────────────────────────────────────────────────

const RESET = "\x1b[0m";
const BOLD = "\x1b[1m";
const DIM = "\x1b[2m";
const GREEN = "\x1b[32m";
const RED = "\x1b[31m";
const CYAN = "\x1b[36m";
const YELLOW = "\x1b[33m";

function die(msg: string): never {
  console.error(`${RED}error${RESET}: ${msg}`);
  process.exit(1);
}

function printTable(rows: Record<string, string>[], columns?: string[]) {
  if (rows.length === 0) {
    console.log(`${DIM}(no results)${RESET}`);
    return;
  }
  const keys = columns ?? Object.keys(rows[0]);
  const widths = keys.map((k) =>
    Math.max(k.length, ...rows.map((r) => (r[k] ?? "").length))
  );

  // header
  console.log(
    keys.map((k, i) => `${BOLD}${k.toUpperCase().padEnd(widths[i])}${RESET}`).join("  ")
  );
  console.log(widths.map((w) => "─".repeat(w)).join("──"));

  // rows
  for (const row of rows) {
    console.log(keys.map((k, i) => (row[k] ?? "").padEnd(widths[i])).join("  "));
  }
}

// ── Config ───────────────────────────────────────────────────────────

const { values: flags, positionals } = parseArgs({
  options: {
    "base-url": { type: "string" },
    json: { type: "boolean", default: false },
    help: { type: "boolean", short: "h", default: false },
  },
  allowPositionals: true,
  strict: false,
});

const baseUrl = (
  (flags["base-url"] as string) ||
  process.env.ARACH_API_URL ||
  "https://arach.io"
).replace(/\/$/, "");

const adminToken = process.env.ADMIN_TOKEN;
const jsonOutput = flags.json as boolean;

function api(path: string) {
  return `${baseUrl}/api/v1${path}`;
}

async function request(
  path: string,
  opts: { method?: string; body?: unknown; auth?: "admin" | "none" } = {}
) {
  const { method = "GET", body, auth = "admin" } = opts;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth === "admin") {
    if (!adminToken) {
      die("ADMIN_TOKEN not set. Add it to .env.local");
    }
    headers["Authorization"] = `Bearer ${adminToken}`;
  }

  const url = api(path);
  let res: Response;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err: any) {
    die(`Could not reach ${baseUrl} — ${err.message}`);
  }

  const text = await res.text();
  let data: any;
  try {
    data = JSON.parse(text);
  } catch {
    die(`${res.status} — unexpected response from ${path}\n  ${text.slice(0, 200)}`);
  }

  if (!res.ok) {
    die(`${res.status} — ${data.error ?? JSON.stringify(data)}`);
  }

  return data;
}

function output(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

// ── Commands ─────────────────────────────────────────────────────────

async function cmdPing() {
  const data = await request("/ping", { auth: "none" });
  if (jsonOutput) return output(data);
  console.log(`${GREEN}ok${RESET} ${DIM}${data.timestamp}${RESET}`);
}

async function cmdTokensCreate(name: string) {
  if (!name) die("Usage: tokens create <agent-name>");

  const data = await request("/tokens", {
    method: "POST",
    body: { agent_name: name },
  });

  if (jsonOutput) return output(data);

  console.log(`${GREEN}Token created${RESET}\n`);
  console.log(`  ${BOLD}ID${RESET}:    ${data.id}`);
  console.log(`  ${BOLD}Agent${RESET}: ${data.agent_name}`);
  console.log(`  ${BOLD}Token${RESET}: ${CYAN}${data.token}${RESET}`);
  console.log(`\n${YELLOW}Save this token now — it cannot be retrieved again.${RESET}`);
}

async function cmdTokensList() {
  const data = await request("/tokens");

  if (jsonOutput) return output(data);

  const rows = data.tokens.map((t: any) => ({
    id: t.id,
    agent: t.agent_name,
    created: t.created_at,
    status: t.revoked_at ? `${RED}revoked${RESET}` : `${GREEN}active${RESET}`,
  }));

  printTable(rows, ["id", "agent", "created", "status"]);
}

async function cmdTokensRevoke(id: string) {
  if (!id) die("Usage: tokens revoke <token-id>");

  const data = await request(`/tokens/${id}`, { method: "DELETE" });

  if (jsonOutput) return output(data);

  console.log(`${GREEN}Revoked${RESET} token ${BOLD}${data.id}${RESET}`);
}

async function cmdMessages() {
  const data = await request("/messages");

  if (jsonOutput) return output(data);

  const rows = data.messages.map((m: any) => ({
    id: m.id.slice(0, 8),
    agent: m.agent_name,
    body: m.body.length > 60 ? m.body.slice(0, 57) + "..." : m.body,
    time: m.created_at,
  }));

  printTable(rows, ["id", "agent", "body", "time"]);
}

async function cmdReply(tokenId: string, body: string) {
  if (!tokenId || !body) die("Usage: reply <token-id> \"message body\"");

  const data = await request("/reply", {
    method: "POST",
    body: { token_id: tokenId, body },
  });

  if (jsonOutput) return output(data);

  console.log(`${GREEN}Reply sent${RESET}\n`);
  console.log(`  ${BOLD}ID${RESET}:    ${data.id}`);
  console.log(`  ${BOLD}Agent${RESET}: ${data.agent_name}`);
  console.log(`  ${BOLD}Body${RESET}:  ${data.body}`);
}

async function cmdReplies(tokenId: string) {
  if (!tokenId) die("Usage: replies <token-id>");

  const data = await request(`/replies/${tokenId}`);

  if (jsonOutput) return output(data);

  const rows = data.replies.map((r: any) => ({
    id: r.id.slice(0, 8),
    agent: r.agent_name,
    body: r.body.length > 60 ? r.body.slice(0, 57) + "..." : r.body,
    reply_to: r.in_reply_to ? r.in_reply_to.slice(0, 8) : "—",
    time: r.created_at,
  }));

  printTable(rows, ["id", "agent", "body", "reply_to", "time"]);
}

function showHelp() {
  console.log(`
${BOLD}arach${RESET} — CLI for arach.io APIs

${BOLD}Usage${RESET}:
  bun arach <command> [options]

${BOLD}Commands${RESET}:
  ${CYAN}ping${RESET}                    Health check
  ${CYAN}tokens create${RESET} <name>    Create a new agent token
  ${CYAN}tokens list${RESET}             List all tokens
  ${CYAN}tokens revoke${RESET} <id>      Revoke a token
  ${CYAN}messages${RESET}                List recent messages
  ${CYAN}reply${RESET} <token-id> "msg"  Send a reply to an agent
  ${CYAN}replies${RESET} <token-id>      View replies sent to an agent

${BOLD}Options${RESET}:
  --base-url <url>   API base (default: https://arach.io, env: ARACH_API_URL)
  --json             Raw JSON output
  -h, --help         Show this help
`.trim());
}

// ── Router ───────────────────────────────────────────────────────────

async function main() {
  if (flags.help || positionals.length === 0) {
    showHelp();
    process.exit(0);
  }

  const [cmd, sub, ...rest] = positionals;

  switch (cmd) {
    case "ping":
      return cmdPing();

    case "tokens":
      switch (sub) {
        case "create":
          return cmdTokensCreate(rest[0]);
        case "list":
        case undefined:
          return cmdTokensList();
        case "revoke":
          return cmdTokensRevoke(rest[0]);
        default:
          die(`Unknown tokens subcommand: ${sub}`);
      }
      break;

    case "messages":
      return cmdMessages();

    case "reply":
      return cmdReply(sub, rest[0]);

    case "replies":
      return cmdReplies(sub);

    default:
      die(`Unknown command: ${cmd}. Run with --help for usage.`);
  }
}

main().catch((err) => {
  die(err.message);
});
