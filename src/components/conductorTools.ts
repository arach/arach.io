/**
 * Facts for the Conductor alternatives post, read by the matrix. Every string
 * comes from the post or from the makers' pages it cites, read 2026-11-04. A
 * tag left out means the pages don't state it, never that the tool lacks it.
 */

export type Need =
  | "remote"
  | "worktrees"
  | "review"
  | "phone"
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
  /** The open-source license, read from the repository. Absent when there is no public repository. */
  license?: string;
  has: Need[];
  /** One line on the tool. */
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
  { id: "free", label: "Free to start", hint: "A free app or a free plan" },
  { id: "conductorImport", label: "Move my Conductor work across", hint: "A documented migration path from Conductor" },
];

export const SHORT: Record<Need, string> = {
  remote: "Remote machines",
  worktrees: "Worktrees",
  review: "Review",
  phone: "Phone",
  free: "Free to start",
  conductorImport: "Conductor import",
};

export const TIER_LABEL: Record<Tier, string> = { major: "Majors", rising: "Up-and-comers" };

export const TOOLS: Tool[] = [
  {
    id: "emdash", name: "Emdash", url: "https://emdash.com/", runs: { own: true, maker: false }, tier: "rising",
    repo: { slug: "generalaction/emdash", stars: 6185 }, has: ["remote", "worktrees", "review", "free"], license: "Apache 2.0",
    note: "macOS, Windows and Linux; remote over SSH.",
    price: "Free.",
    caveat: "The stable v1 and the 2.0 waitlist are separate things.",
  },
  {
    id: "orca", name: "Orca", url: "https://www.onorca.dev/", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "stablyai/orca", stars: 115383 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "MIT",
    note: "Desktop and mobile; remote means your machines.",
    price: "Free, MIT.",
  },
  {
    id: "paseo", name: "Paseo", url: "https://paseo.sh/docs", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "getpaseo/paseo", stars: 23068 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "Apache 2.0",
    note: "Free app; clients drive daemons on your machines. Hub Pro is $15 per seat.",
    price: "Free and open source. The optional Hub Pro is $15 per seat per month.",
    models: "Model and machine costs stay yours.",
    caveat: "The hosted Hub manages triggers, not agent compute.",
  },
  {
    id: "t3-code", name: "T3 Code", url: "https://t3.codes/", runs: { own: true, maker: false }, tier: "major",
    repo: { slug: "pingdotgg/t3code", stars: 46433 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "MIT",
    note: "Remote over LAN, Tailscale, SSH or T3's tunnels. Early.",
    price: "Free. A paid plan raises the machine limit.",
    caveat: "T3 Connect, the easy remote route, uses T3's cloud tunnels and needs a sign-in. The repository warns that the project is early.",
  },
  {
    id: "traycer", name: "Traycer", url: "https://docs.traycer.ai/account/pricing", runs: { own: true, maker: false }, tier: "rising",
    repo: { slug: "traycerai/traycer", stars: 1653 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "MIT",
    note: "Free for individuals; Sync is $20 per user.",
    price: "Free for individuals. Sync is $20 per user per month.",
    models: "Provider costs are separate. Optional Traycer inference adds 20% and includes no monthly credits.",
    historyImport: true,
    caveat: "The automatic judge can spend credits. An open report describes memory and queue issues; I didn't reproduce it.",
  },
  {
    id: "boxes", name: "Boxes.dev", url: "https://boxes.dev/", runs: { own: false, maker: true }, tier: "rising",
    has: ["review", "phone"],
    note: "Hosted Linux computers. Starter is $19 per seat.",
    price: "Starter is $19 per seat with 50 box-hours, four awake devboxes and a Template. Extra usage is $0.60 per box-hour; a standard hour is 4 vCPU and 8 GiB.",
    models: "Models cost extra.",
    historyImport: true,
    caveat: "Larger boxes and an awake Template use more box-hours.",
  },
  {
    id: "cloudroom", name: "Cloudroom", url: "https://www.cloudroom.dev/docs/faq", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "davidondrej/cloudroom", stars: 1359 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "Apache 2.0",
    note: "Open-source Core on your own server; GPUs only on its cloud. Free plan; Pro is $50.",
    price: "Free plan with 3,000 cloud credits a month. Pro is US$50 a month.",
    models: "Compute credits don't cover models.",
    caveat: "Core runs on your own Ubuntu 24.04 server. GPUs, Cloud loops and computer use run only on Cloudroom Cloud, and local diff and worktree features don't mean the cloud has them.",
  },
  {
    id: "capy", name: "Capy", url: "https://capy.ai/", runs: { own: true, maker: true }, tier: "rising",
    has: ["remote", "worktrees", "review", "phone"],
    note: "Cloud VMs or worktrees on your own computer, with PRs, CI fixes and a review agent. Lite is $20.",
    price: "Lite is $20 a month with $20 of credits, Pro $100 and Max from $200, with no seat fees. Lite's first week costs $1.",
    models: "Your own subscriptions and keys cost nothing on any plan; threads on your own computer have no machine-time charge.",
    caveat: "No phone app; capy.ai works in a phone browser.",
  },
  {
    id: "cmux", name: "cmux", url: "https://cmux.com/pricing", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "manaflow-ai/cmux", stars: 28690 }, has: ["remote", "phone", "free"], license: "GPL 3.0",
    note: "Free Mac app; cloud VMs are paid early access.",
    price: "Free app. Pro starts at $50 a month, and the pricing page has also shown a $15 Plus tier with one saved cloud VM.",
    models: "Local agents use your own API keys at no cost. On cloud VMs, agents use your team's accounts through CodeRouter.",
    caveat: "Cloud VMs are paid early access. I couldn't confirm automatic worktrees per task.",
  },
  {
    id: "orchestrator", name: "Orchestrator", url: "https://orchestrator.inc/pricing/", runs: { own: true, maker: true }, tier: "rising",
    repo: { slug: "OrchestratorInc/agent-orchestrator", stars: 14092 }, has: ["remote", "worktrees", "review", "phone", "free"], license: "Apache 2.0",
    note: "Free local plan; cloud Starter is $20.",
    price: "Free local plan. Starter is $20.",
    models: "I couldn't establish whether cloud includes model costs.",
    caveat: "Hosted execution needs an enabled build and account access.",
  },
  {
    id: "paradev", name: "Paradev", url: "https://paradev.com/", runs: { own: true, maker: true }, tier: "major",
    repo: { slug: "ParadevAI/Paradev", stars: 15919 }, has: ["remote", "worktrees", "review", "phone", "free", "conductorImport"], license: "MIT",
    note: "Free for one user, locally. Pro is $20 per user; the beta cloud starts on Team.",
    price: "Free for one user on local workspaces. Pro is $20 per user per month. Cloud workspaces start on Team, at $60 per user per month with 150 hours per seat.",
    models: "Models cost extra.",
    caveat: "The cloud is in beta. Scripts need converting, and archiving an adopted worktree in Conductor can delete its shared folder.",
  },
  {
    id: "replicas", name: "Replicas", url: "https://replicas.dev/", runs: { own: false, maker: true }, tier: "rising",
    has: ["review", "phone", "conductorImport"],
    note: "Hosted workspaces, with a move from Conductor Cloud. $50 a month.",
    price: "Developer is $50 a month and includes $50 of usage.",
    models: "You bring your own model credentials.",
    caveat: "It has desktop and mobile clients, but the agents run on its computers. Its Conductor guide covers Cloud work, not local worktrees, and it can't import chats.",
  },
  {
    id: "superconductor", name: "Superconductor", url: "https://www.superconductor.com/pricing", runs: { own: false, maker: true }, tier: "rising",
    has: ["review", "phone", "free"],
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
