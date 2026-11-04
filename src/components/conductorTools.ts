import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared facts for the Conductor alternatives post, used by the worksheet and
 * the side-by-side compare. Every string comes from the post or from the
 * makers' pages it cites, read 2026-11-04. A field left out means the post
 * doesn't state it; the UI shows "Not stated", never "No".
 *
 * The page URL carries the reader's picks as a query string, so a filtered
 * worksheet or a comparison can be shared:
 *   ?where=own&needs=remote,phone#worksheet
 *   ?compare=orca,paseo,paradev#compare
 */

export type Need =
  | "remote"
  | "worktrees"
  | "review"
  | "phone"
  | "openSource"
  | "free"
  | "conductorImport";

/** The author's editorial split: established names people already move to (majors), and newer or smaller tools (up-and-comers). */
export type Tier = "major" | "rising";

export type Tool = {
  /** URL slug for deep links. Lowercase letters, digits and hyphens only. */
  id: string;
  name: string;
  url: string;
  runs: { own: boolean; maker: boolean };
  tier: Tier;
  /** GitHub stars on the public repository, read 2026-11-04. Absent when the maker publishes no repository. */
  repo?: { slug: string; stars: number };
  has: Need[];
  /** One line for the worksheet row. */
  note: string;
  /** Pricing as the post states it. */
  price: string;
  /** Who pays for model tokens, where the post says. */
  models?: string;
  /** Imports local conversation history from the model provider (post, "What moves over"). */
  historyImport?: boolean;
  /** Limits and open questions the post raises. */
  caveat?: string;
};

export const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "remote", label: "Reach my own remote machines", hint: "A desktop at home, a server, a box over SSH" },
  { id: "worktrees", label: "A worktree per task", hint: "Parallel agents that don't step on each other" },
  { id: "review", label: "Review or a PR workflow in the app", hint: "Diffs and pull requests without leaving it" },
  { id: "phone", label: "A phone client", hint: "Check on agents away from the desk" },
  { id: "openSource", label: "An open-source license", hint: "Only where the license itself was confirmed" },
  { id: "free", label: "Free to start", hint: "A free app or a free plan" },
  { id: "conductorImport", label: "Move my Conductor work across", hint: "A documented migration path from Conductor" },
];

export const SHORT: Record<Need, string> = {
  remote: "Remote machines",
  worktrees: "Worktrees",
  review: "Review",
  phone: "Phone",
  openSource: "Open source",
  free: "Free to start",
  conductorImport: "Conductor import",
};

export const TIER_LABEL: Record<Tier, string> = { major: "Majors", rising: "Up-and-comers" };

export const TOOLS: Tool[] = [
  {
    id: "emdash", name: "Emdash", url: "https://emdash.com/", runs: { own: true, maker: false }, tier: "rising",
    repo: { slug: "generalaction/emdash", stars: 6185 }, has: ["remote", "worktrees", "review", "openSource", "free"],
    note: "macOS, Windows and Linux; remote over SSH.",
    price: "Free.",
    caveat: "The stable v1 and the 2.0 waitlist are separate things.",
  },
  {
    id: "orca", name: "Orca", url: "https://www.onorca.dev/", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "stablyai/orca", stars: 115383 }, has: ["remote", "worktrees", "review", "phone", "openSource", "free"],
    note: "Desktop and mobile; remote means your machines.",
    price: "Free, MIT.",
  },
  {
    id: "paseo", name: "Paseo", url: "https://paseo.sh/docs", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "getpaseo/paseo", stars: 23068 }, has: ["remote", "phone", "openSource", "free"],
    note: "Free app; clients drive daemons on your machines. Hub Pro is $15 per seat.",
    price: "Free and open source. The optional Hub Pro is $15 per seat per month.",
    models: "Model and machine costs stay yours.",
    caveat: "The hosted Hub manages triggers, not agent compute.",
  },
  {
    id: "t3-code", name: "T3 Code", url: "https://t3.codes/", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "pingdotgg/t3code", stars: 46433 }, has: ["remote", "worktrees", "review", "phone", "openSource", "free"],
    note: "Remote over LAN, Tailscale, SSH or T3's tunnels. Early.",
    price: "Free. A paid plan raises the machine limit.",
    caveat: "T3 Connect, the easy remote route, uses T3's cloud tunnels and needs a sign-in. The repository warns that the project is early.",
  },
  {
    id: "traycer", name: "Traycer", url: "https://docs.traycer.ai/account/pricing", runs: { own: true, maker: false }, tier: "rising",
    repo: { slug: "traycerai/traycer", stars: 1653 }, has: ["remote", "worktrees", "review", "openSource", "free"],
    note: "Free for individuals; Team Sync is $20 per user.",
    price: "Free for individuals. Team Sync is $20 per user per month.",
    models: "Provider costs are separate. Optional Traycer inference adds 20% and includes no monthly credits.",
    historyImport: true,
    caveat: "The automatic judge can spend credits. An open report describes memory and queue issues; I didn't reproduce it.",
  },
  {
    id: "boxes", name: "Boxes.dev", url: "https://boxes.dev/", runs: { own: false, maker: true }, tier: "rising",
    has: [],
    note: "Hosted Linux computers. Starter is $19 per seat.",
    price: "Starter is $19 per seat with 50 box-hours, four awake devboxes and a Template. Extra usage is $0.60 per box-hour; a standard hour is 4 vCPU and 8 GiB.",
    models: "Models cost extra.",
    historyImport: true,
    caveat: "Larger boxes and an awake Template use more box-hours.",
  },
  {
    id: "cloudroom", name: "Cloudroom", url: "https://www.cloudroom.dev/docs/faq", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "davidondrej/cloudroom", stars: 1359 }, has: ["remote", "worktrees", "openSource"],
    note: "Open-source Core on your own server; GPUs only on its cloud. Pro is $50.",
    price: "Pro is US$50 a month.",
    models: "Compute credits don't cover models.",
    caveat: "Core runs on your own Ubuntu 24.04 server. GPUs, Cloud loops and computer use run only on Cloudroom Cloud, and local diff and worktree features don't mean the cloud has them.",
  },
  {
    id: "cmux", name: "cmux", url: "https://cmux.com/pricing", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "manaflow-ai/cmux", stars: 28690 }, has: ["openSource", "free"],
    note: "Free Mac app; cloud VMs are paid early access.",
    price: "Free app. Pro starts at $50 a month, and the pricing page has also shown a $15 Plus tier with one saved cloud VM.",
    models: "Local agents use your own API keys at no cost. The pricing page doesn't say how model costs work on cloud VMs.",
    caveat: "Cloud VMs are paid early access. I couldn't confirm automatic worktrees per task.",
  },
  {
    id: "orchestrator", name: "Orchestrator", url: "https://orchestrator.inc/pricing/", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "OrchestratorInc/agent-orchestrator", stars: 14092 }, has: ["worktrees", "review", "openSource", "free"],
    note: "Free local plan; cloud Starter is $20.",
    price: "Free local plan. Starter is $20.",
    models: "I couldn't establish whether cloud includes model costs.",
    caveat: "Hosted execution needs an enabled build and account access.",
  },
  {
    id: "paradev", name: "Paradev", url: "https://paradev.com/", runs: { own: true, maker: true }, tier: "major",
    repo: { slug: "ParadevAI/Paradev", stars: 15919 }, has: ["worktrees", "openSource", "conductorImport"],
    note: "Cloud is in beta. Pro is $20 per user.",
    price: "Pro is $20 per user per month and includes 320 GB-hours per seat, which is 40 hours at 8 GB.",
    models: "Models cost extra.",
    caveat: "The cloud is in beta. Scripts need converting, and archiving an adopted worktree in Conductor can delete its shared folder.",
  },
  {
    id: "replicas", name: "Replicas", url: "https://replicas.dev/", runs: { own: false, maker: true }, tier: "rising",
    has: ["phone", "conductorImport"],
    note: "Hosted workspaces, with a move from Conductor Cloud. $50 a month.",
    price: "Developer is $50 a month and includes $50 of usage.",
    models: "You bring your own model credentials.",
    caveat: "It has desktop and mobile clients, but the agents run on its computers. Its Conductor guide covers Cloud work, not local worktrees, and it can't import chats.",
  },
  {
    id: "superconductor", name: "Superconductor", url: "https://www.superconductor.com/pricing", runs: { own: false, maker: true }, tier: "rising",
    has: ["review", "free"],
    note: "Hosted, with PR review. Pro from $50 for 20,000 credits.",
    price: "The free plan includes 20,000 credits, and compute costs 100 credits an hour at 1 vCPU and 2 GB. Pro starts at $50 a month for 20,000 credits and rises with the credits you pick.",
    models: "Model tokens can come out of credits. Bring your own tokens and credits go only to the cloud computers.",
    caveat: "The maker's offer of free Pro for Conductor customers has no terms on the pricing page.",
  },
];

export const TOOL_BY_ID = new Map(TOOLS.map(t => [t.id, t]));

export const runsLabel = (t: Tool) =>
  t.runs.own && t.runs.maker ? "Local and cloud" : t.runs.own ? "Local" : "Cloud";

export const formatStars = (n: number) =>
  n < 1000 ? `${n}` : n < 10000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n / 1000)}k`;

/** Joins names as a sentence: "Orca", "Orca and Paseo", "Orca, Paseo and Paradev". */
export const listNames = (names: string[]) =>
  names.length <= 1 ? names.join("") : `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;

/* ---------- URL state ---------- */

export const MAX_COMPARE = 3;

/** Fired after a component writes shared state into the URL, so the other island can follow. */
export const STATE_EVENT = "conductor:state";

const KEY_ORDER = ["where", "which", "needs", "compare"] as const;
type Key = (typeof KEY_ORDER)[number];

const SAFE = /^[a-zA-Z0-9,-]*$/;

export function readParam(key: Key): string | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get(key);
  return v !== null && SAFE.test(v) ? v : null;
}

export const readList = (key: Key) => (readParam(key) ?? "").split(",").filter(Boolean);

/** The compare list from the URL: known ids only, no repeats, at most three. */
export const readCompare = () =>
  [...new Set(readList("compare"))].filter(id => TOOL_BY_ID.has(id)).slice(0, MAX_COMPARE);

/**
 * Sets or clears our keys in the query string and leaves every other parameter
 * and the hash alone. Values are slugs, so commas stay literal and the link
 * reads cleanly. Uses replaceState, so picks don't pile up in the back button.
 */
export function writeParams(values: Partial<Record<Key, string | null>>, notify = false) {
  const url = new URL(window.location.href);
  const ours = new Map<Key, string>();
  for (const k of KEY_ORDER) {
    const v = k in values ? values[k] : url.searchParams.get(k);
    if (v) ours.set(k, v);
    url.searchParams.delete(k);
  }
  const rest = url.searchParams.toString();
  const mine = [...ours].map(([k, v]) => `${k}=${v}`).join("&");
  const query = [mine, rest].filter(Boolean).join("&");
  history.replaceState(history.state, "", `${url.pathname}${query ? `?${query}` : ""}${url.hash}`);
  if (notify) window.dispatchEvent(new Event(STATE_EVENT));
}

export function toggleCompare(id: string) {
  const current = readCompare();
  const next = current.includes(id)
    ? current.filter(x => x !== id)
    : current.length < MAX_COMPARE
      ? [...current, id]
      : current;
  writeParams({ compare: next.join(",") || null }, true);
}

/** The compare list, kept in step with the URL and the other island. */
export function useCompareList(): string[] {
  const [list, setList] = useState<string[]>([]);
  useEffect(() => {
    const sync = () => setList(readCompare());
    sync();
    window.addEventListener(STATE_EVENT, sync);
    return () => window.removeEventListener(STATE_EVENT, sync);
  }, []);
  return list;
}

/** Copies the current URL with the given anchor. Status reads "Link copied" or a fallback for two seconds. */
export function useCopyLink(anchor: string) {
  const [status, setStatus] = useState("");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = useCallback(() => {
    const url = new URL(window.location.href);
    url.hash = anchor;
    const show = (s: string) => {
      setStatus(s);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setStatus(""), 2000);
    };
    if (!navigator.clipboard) {
      show("Copy it from the address bar");
      return;
    }
    navigator.clipboard.writeText(url.toString()).then(
      () => show("Link copied"),
      () => show("Copy it from the address bar"),
    );
  }, [anchor]);
  return { status, copy };
}
