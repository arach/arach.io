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
  has: Need[];
  note: string;
};

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
  { name: "Emdash", url: "https://emdash.com/", runs: { own: true, maker: false }, has: ["remote", "worktrees", "review", "free"], note: "macOS, Windows and Linux; remote over SSH." },
  { name: "omux", url: "https://github.com/onurozcan/omux", runs: { own: true, maker: false }, has: ["worktrees", "openSource", "free"], note: "Apple Silicon Macs only. Worktrees are optional." },
  { name: "Orca", url: "https://www.onorca.dev/", runs: { own: true, maker: false }, has: ["remote", "worktrees", "review", "phone", "openSource", "free"], note: "Desktop and mobile; remote means your machines." },
  { name: "Paseo", url: "https://paseo.sh/docs", runs: { own: true, maker: false }, has: ["remote", "phone"], note: "Clients drive daemons on your machines. Hub Pro is $15 per seat." },
  { name: "T3 Code", url: "https://t3.codes/", runs: { own: true, maker: false }, has: ["remote", "worktrees", "review", "phone", "free"], note: "Remote access runs through T3's cloud tunnels. Early." },
  { name: "Traycer", url: "https://docs.traycer.ai/account/pricing", runs: { own: true, maker: false }, has: ["remote", "worktrees", "review", "openSource", "free"], note: "Free for individuals; Team Sync is $20 per user." },
  { name: "Boxes.dev", url: "https://boxes.dev/", runs: { own: false, maker: true }, has: [], note: "Hosted Linux computers. Starter is $19 per seat." },
  { name: "Cloudroom", url: "https://www.cloudroom.dev/docs/faq", runs: { own: true, maker: true }, has: ["remote", "worktrees", "openSource"], note: "Open-source Core on your own server; GPUs only on its cloud. Pro is $50." },
  { name: "cmux", url: "https://cmux.com/pricing", runs: { own: true, maker: true }, has: ["free"], note: "Free Mac app; cloud VMs are paid early access." },
  { name: "Orchestrator", url: "https://orchestrator.inc/pricing/", runs: { own: true, maker: true }, has: ["worktrees", "review", "free"], note: "Free local plan; cloud Starter is $20." },
  { name: "Paradev", url: "https://paradev.com/", runs: { own: true, maker: true }, has: ["worktrees", "conductorImport"], note: "Cloud is in beta. Pro is $20 per user." },
  { name: "Replicas", url: "https://replicas.dev/", runs: { own: false, maker: true }, has: ["phone"], note: "Hosted workspaces; clients don't mean local execution. $50 a month." },
  { name: "Superconductor", url: "https://www.superconductor.com/pricing", runs: { own: false, maker: true }, has: ["review", "free"], note: "Hosted, with PR review. Its pricing page and docs disagree on Pro." },
];

type Where = "either" | "own" | "maker";

const WHERE: { id: Where; label: string }[] = [
  { id: "either", label: "Either" },
  { id: "own", label: "On my machines" },
  { id: "maker", label: "On the maker's computers" },
];

export default function ConductorWorksheet() {
  const [where, setWhere] = useState<Where>("either");
  const [needs, setNeeds] = useState<Set<Need>>(new Set());

  const toggle = (id: Need) =>
    setNeeds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const { matches, others } = useMemo(() => {
    const placed = TOOLS.filter(t => where === "either" || t.runs[where]);
    const missing = (t: Tool) => [...needs].filter(n => !t.has.includes(n));
    return {
      matches: placed.filter(t => missing(t).length === 0),
      others: placed
        .map(t => ({ tool: t, missing: missing(t) }))
        .filter(x => x.missing.length > 0),
    };
  }, [where, needs]);

  const labelFor = (n: Need) => NEEDS.find(x => x.id === n)?.label.toLowerCase() ?? n;

  return (
    <div className="not-prose my-10 rounded border border-skin-line bg-skin-card-muted p-5 text-skin-base sm:p-6">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid gap-5">
          <fieldset className="grid gap-2">
            <legend className="mb-2 text-xs uppercase tracking-wider opacity-70">1. Where should the agents run?</legend>
            {WHERE.map(w => (
              <label key={w.id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input
                  id={`where-${w.id}`}
                  type="radio"
                  name="conductor-where"
                  checked={where === w.id}
                  onChange={() => setWhere(w.id)}
                  className="accent-current"
                />
                {w.label}
              </label>
            ))}
          </fieldset>

          <fieldset className="grid gap-3">
            <legend className="mb-2 text-xs uppercase tracking-wider opacity-70">2. What do you need?</legend>
            {NEEDS.map(n => (
              <label key={n.id} className="flex cursor-pointer items-start gap-2 text-sm">
                <input
                  id={`need-${n.id}`}
                  type="checkbox"
                  checked={needs.has(n.id)}
                  onChange={() => toggle(n.id)}
                  className="mt-1 accent-current"
                />
                <span className="grid">
                  <span>{n.label}</span>
                  <span className="text-xs opacity-60">{n.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>
        </div>

        <div className="grid content-start gap-4" aria-live="polite">
          <div className="text-xs uppercase tracking-wider opacity-70">3. Tools that fit</div>
          {matches.length === 0 ? (
            <p className="text-sm opacity-80">
              None of these tools' own pages back everything you ticked. Untick the least important one, or check the makers' docs directly.
            </p>
          ) : (
            <ul className="grid gap-3">
              {matches.map(t => (
                <li key={t.name} className="border-b border-skin-line pb-3 text-sm last:border-b-0">
                  <a href={t.url} className="font-medium underline decoration-1 underline-offset-2" target="_blank" rel="noopener">
                    {t.name}
                  </a>
                  <div className="opacity-75">{t.note}</div>
                </li>
              ))}
            </ul>
          )}
          {others.length > 0 && (
            <details className="text-sm">
              <summary className="cursor-pointer opacity-70">Not a match ({others.length})</summary>
              <ul className="mt-2 grid gap-1">
                {others.map(({ tool, missing }) => (
                  <li key={tool.name} className="opacity-75">
                    <span className="font-medium">{tool.name}:</span> not stated on its pages for {missing.map(labelFor).join(", ")}.
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
      <p className="mt-5 text-xs opacity-60">
        A tool counts only where its own pages say so, as of November 4, 2026. A blank means the pages didn't say, not that the tool can't.
      </p>
    </div>
  );
}
