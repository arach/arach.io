import React, { useMemo, useState } from "react";

/**
 * A worksheet readers fill in on their own: pick where the agents should run
 * and tick what you need, and the list narrows to the tools whose own pages
 * back every ticked requirement. Facts come from the makers' pages, checked on
 * 2026-11-04 (see the post). A requirement is only marked when a page says so;
 * "not stated" never counts as a match.
 */

type Need =
  | "remote"
  | "worktrees"
  | "review"
  | "phone"
  | "openSource"
  | "free"
  | "conductorImport";

type Tool = {
  name: string;
  url: string;
  runs: { own: boolean; maker: boolean };
  tier: Tier;
  /** GitHub stars on the public repository, read 2026-11-04. Absent when the maker publishes no repository. */
  repo?: { slug: string; stars: number };
  has: Need[];
  note: string;
};

/** The author's editorial split: established names people already move to (majors), and newer or smaller tools (up-and-comers). */
type Tier = "major" | "rising";

const NEEDS: { id: Need; label: string; hint: string }[] = [
  { id: "remote", label: "Reach my own remote machines", hint: "A desktop at home, a server, a box over SSH" },
  { id: "worktrees", label: "A worktree per task", hint: "Parallel agents that don't step on each other" },
  { id: "review", label: "Review or a PR workflow in the app", hint: "Diffs and pull requests without leaving it" },
  { id: "phone", label: "A phone client", hint: "Check on agents away from the desk" },
  { id: "openSource", label: "An open-source license", hint: "Only where the license itself was confirmed" },
  { id: "free", label: "Free to start", hint: "A free app or a free plan" },
  { id: "conductorImport", label: "Bring my Conductor worktrees across", hint: "A documented migration path" },
];

const TOOLS: Tool[] = [
  { name: "Emdash", url: "https://emdash.com/", runs: { own: true, maker: false }, tier: "rising", repo: { slug: "generalaction/emdash", stars: 6185 }, has: ["remote", "worktrees", "review", "free"], note: "macOS, Windows and Linux; remote over SSH." },
  { name: "omux", url: "https://github.com/onurozcan/omux", runs: { own: true, maker: false }, tier: "rising", repo: { slug: "onurozcan/omux", stars: 125 }, has: ["worktrees", "openSource", "free"], note: "Apple Silicon Macs only. Worktrees are optional." },
  { name: "Orca", url: "https://www.onorca.dev/", runs: { own: true, maker: false }, tier: "major", repo: { slug: "stablyai/orca", stars: 115383 }, has: ["remote", "worktrees", "review", "phone", "openSource", "free"], note: "Desktop and mobile; remote means your machines." },
  { name: "Paseo", url: "https://paseo.sh/docs", runs: { own: true, maker: false }, tier: "major", repo: { slug: "getpaseo/paseo", stars: 23068 }, has: ["remote", "phone"], note: "Clients drive daemons on your machines. Hub Pro is $15 per seat." },
  { name: "T3 Code", url: "https://t3.codes/", runs: { own: true, maker: false }, tier: "major", repo: { slug: "pingdotgg/t3code", stars: 46433 }, has: ["remote", "worktrees", "review", "phone", "free"], note: "Remote access runs through T3's cloud tunnels. Early." },
  { name: "Traycer", url: "https://docs.traycer.ai/account/pricing", runs: { own: true, maker: false }, tier: "rising", repo: { slug: "traycerai/traycer", stars: 1653 }, has: ["remote", "worktrees", "review", "openSource", "free"], note: "Free for individuals; Team Sync is $20 per user." },
  { name: "Boxes.dev", url: "https://boxes.dev/", runs: { own: false, maker: true }, tier: "rising", has: [], note: "Hosted Linux computers. Starter is $19 per seat." },
  { name: "Cloudroom", url: "https://www.cloudroom.dev/docs/faq", runs: { own: true, maker: true }, tier: "rising", repo: { slug: "davidondrej/cloudroom", stars: 1359 }, has: ["remote", "worktrees", "openSource"], note: "Open-source Core on your own server; GPUs only on its cloud. Pro is $50." },
  { name: "cmux", url: "https://cmux.com/pricing", runs: { own: true, maker: true }, tier: "rising", repo: { slug: "manaflow-ai/cmux", stars: 28690 }, has: ["free"], note: "Free Mac app; cloud VMs are paid early access." },
  { name: "Orchestrator", url: "https://orchestrator.inc/pricing/", runs: { own: true, maker: true }, tier: "rising", repo: { slug: "OrchestratorInc/agent-orchestrator", stars: 14092 }, has: ["worktrees", "review", "free"], note: "Free local plan; cloud Starter is $20." },
  { name: "Paradev", url: "https://paradev.com/", runs: { own: true, maker: true }, tier: "major", repo: { slug: "ParadevAI/Paradev", stars: 15919 }, has: ["worktrees", "conductorImport"], note: "Cloud is in beta. Pro is $20 per user." },
  { name: "Replicas", url: "https://replicas.dev/", runs: { own: false, maker: true }, tier: "major", has: ["phone"], note: "Hosted workspaces; clients don't mean local execution. $50 a month." },
  { name: "Superconductor", url: "https://www.superconductor.com/pricing", runs: { own: false, maker: true }, tier: "rising", has: ["review", "free"], note: "Hosted, with PR review. Its pricing page and docs disagree on Pro." },
];

type Where = "either" | "own" | "maker";

const WHERE: { id: Where; label: string }[] = [
  { id: "either", label: "Either" },
  { id: "own", label: "On my machines" },
  { id: "maker", label: "On the maker's computers" },
];

type Which = "both" | Tier;

const WHICH: { id: Which; label: string }[] = [
  { id: "both", label: "Both" },
  { id: "major", label: "Majors" },
  { id: "rising", label: "Up-and-comers" },
];

const TIER_LABEL: Record<Tier, string> = { major: "Majors", rising: "Up-and-comers" };

const SHORT: Record<Need, string> = {
  remote: "Remote machines",
  worktrees: "Worktrees",
  review: "Review",
  phone: "Phone",
  openSource: "Open source",
  free: "Free to start",
  conductorImport: "Conductor import",
};

const formatStars = (n: number) =>
  n < 1000 ? `${n}` : n < 10000 ? `${(n / 1000).toFixed(1)}k` : `${Math.round(n / 1000)}k`;

const runsLabel = (t: Tool) =>
  t.runs.own && t.runs.maker ? "Yours or theirs" : t.runs.own ? "Your machines" : "Their computers";

export default function ConductorWorksheet() {
  const [where, setWhere] = useState<Where>("either");
  const [which, setWhich] = useState<Which>("both");
  const [needs, setNeeds] = useState<Set<Need>>(new Set());

  const toggle = (id: Need) =>
    setNeeds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const reset = () => {
    setWhere("either");
    setWhich("both");
    setNeeds(new Set());
  };

  const { matches, others } = useMemo(() => {
    const placed = TOOLS.filter(
      t => (where === "either" || t.runs[where]) && (which === "both" || t.tier === which),
    );
    const missing = (t: Tool) => [...needs].filter(n => !t.has.includes(n));
    return {
      matches: placed.filter(t => missing(t).length === 0),
      others: placed
        .map(t => ({ tool: t, missing: missing(t) }))
        .filter(x => x.missing.length > 0),
    };
  }, [where, which, needs]);

  const chip = (on: boolean) =>
    [
      "rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-skin-fill",
      on
        ? "border-skin-fill bg-skin-inverted text-skin-inverted"
        : "border-skin-line bg-skin-fill hover:border-skin-fill",
    ].join(" ");

  const filtered = where !== "either" || which !== "both" || needs.size > 0;

  return (
    <div className="not-prose my-10 rounded border border-skin-line bg-skin-card-muted text-skin-base">
      <div className="grid gap-5 border-b border-skin-line p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-10">
          <Choice label="Where should the agents run?" name="where" options={WHERE} value={where} onChange={v => setWhere(v)} chip={chip} />
          <Choice label="Which tools?" name="which" options={WHICH} value={which} onChange={v => setWhich(v)} chip={chip} />
        </div>

        <div className="grid gap-2">
          <div className="text-xs uppercase tracking-wider opacity-70">What do you need?</div>
          <div className="flex flex-wrap gap-2">
            {NEEDS.map(n => (
              <button
                key={n.id}
                id={`need-${n.id}`}
                type="button"
                aria-pressed={needs.has(n.id)}
                title={n.hint}
                onClick={() => toggle(n.id)}
                className={chip(needs.has(n.id))}
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-1 p-5 sm:p-6" aria-live="polite">
        <div className="mb-2 flex items-baseline justify-between gap-4">
          <div className="text-xs uppercase tracking-wider opacity-70">
            {matches.length === 1 ? "1 tool fits" : `${matches.length} tools fit`}
          </div>
          {filtered && (
            <button type="button" onClick={reset} className="text-xs underline decoration-1 underline-offset-2 opacity-70 hover:opacity-100">
              Clear
            </button>
          )}
        </div>

        {matches.length === 0 ? (
          <p className="py-2 text-sm opacity-80">
            No tool's own pages back everything you picked. Drop the least important need, or check the makers' docs directly.
          </p>
        ) : (
          <div className="grid gap-4">
            {(["major", "rising"] as Tier[]).map(tier => {
              const group = matches.filter(t => t.tier === tier);
              if (group.length === 0) return null;
              return (
                <div key={tier} role="group" aria-label={TIER_LABEL[tier]}>
                  <div role="heading" aria-level={3} className="mb-1 border-b border-skin-line pb-1 text-sm font-medium">
                    {TIER_LABEL[tier]} <span className="font-normal opacity-60">{group.length}</span>
                  </div>
                  <ul>
                    {group.map(t => (
                      <Row key={t.name} t={t} needs={needs} />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        {others.length > 0 && (
          <details className="mt-3 border-t border-skin-line pt-3 text-sm">
            <summary className="cursor-pointer opacity-70">
              {others.length === 1 ? "1 other tool" : `${others.length} other tools`}, and what their pages don't state
            </summary>
            <ul className="mt-2 grid gap-1">
              {others.map(({ tool, missing }) => (
                <li key={tool.name} className="opacity-75">
                  <span className="font-medium">{tool.name}:</span> {missing.map(m => SHORT[m].toLowerCase()).join(", ")}
                </li>
              ))}
            </ul>
          </details>
        )}

        <p className="mt-4 text-xs opacity-60">
          The majors and up-and-comers split is my own call. Stars are from GitHub on November 4, 2026. A tool counts only where its own pages say so, as of November 4, 2026. A missing tag means the pages didn't say, not that the tool can't.
        </p>
      </div>
    </div>
  );
}

function Choice<T extends string>({
  label,
  name,
  options,
  value,
  onChange,
  chip,
}: {
  label: string;
  name: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  chip: (on: boolean) => string;
}) {
  return (
    <div className="grid content-start gap-2">
      <div className="text-xs uppercase tracking-wider opacity-70">{label}</div>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map(o => (
          <button
            key={o.id}
            id={`${name}-${o.id}`}
            type="button"
            role="radio"
            aria-checked={value === o.id}
            onClick={() => onChange(o.id)}
            className={chip(value === o.id)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Row({ t, needs }: { t: Tool; needs: Set<Need> }) {
  return (
    <li className="grid gap-x-6 gap-y-1 border-t border-skin-line py-3 text-sm first:border-t-0 sm:grid-cols-[9rem_minmax(0,1fr)]">
      <div className="grid content-start">
        <a href={t.url} className="font-medium underline decoration-1 underline-offset-2" target="_blank" rel="noopener">
          {t.name}
        </a>
        <span className="text-xs opacity-60">{runsLabel(t)}</span>
        {t.repo ? (
          <a
            href={`https://github.com/${t.repo.slug}`}
            className="text-xs opacity-60 hover:opacity-100"
            target="_blank"
            rel="noopener"
            title={`${t.repo.stars.toLocaleString("en-US")} GitHub stars`}
          >
            {formatStars(t.repo.stars)} stars
          </a>
        ) : (
          <span className="text-xs opacity-60">No public repo</span>
        )}
      </div>
      <div className="grid min-w-0 gap-2">
        <span className="opacity-80">{t.note}</span>
        {t.has.length > 0 && (
          <span className="flex flex-wrap gap-1">
            {t.has.map(h => (
              <span
                key={h}
                className={["rounded-sm border px-1.5 text-xs", needs.has(h) ? "border-skin-fill" : "border-skin-line opacity-60"].join(" ")}
              >
                {SHORT[h]}
              </span>
            ))}
          </span>
        )}
      </div>
    </li>
  );
}
