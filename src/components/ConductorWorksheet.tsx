import React, { useMemo, useState } from "react";

/**
 * A worksheet readers fill in on their own: pick where the agents should run
 * and tick what you need, and the list narrows to the tools whose own pages
 * back every ticked requirement. Facts come from the makers' pages, checked on
 * 2026-11-04 (see the post). A requirement is only marked when a page says so;
 * "not stated" never counts as a match.
 */

import { NEEDS, SHORT, TIER_LABEL, TOOLS, formatStars, runsLabel, type Need, type Tier, type Tool } from "./conductorTools";

type Where = "either" | "own" | "maker";

const WHERE: { id: Where; label: string }[] = [
  { id: "either", label: "Either" },
  { id: "own", label: "Local" },
  { id: "maker", label: "Cloud" },
];

type Which = "both" | Tier;

const WHICH: { id: Which; label: string }[] = [
  { id: "both", label: "Both" },
  { id: "major", label: "Majors" },
  { id: "rising", label: "Up-and-comers" },
];

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

  const groups = useMemo(() => {
    const missing = (t: Tool) => [...needs].filter(n => !t.has.includes(n));
    const tiers: Tier[] = which === "both" ? ["major", "rising"] : [which];
    return tiers.map(tier => {
      const placed = TOOLS.filter(t => t.tier === tier && (where === "either" || t.runs[where]));
      return {
        tier,
        total: placed.length,
        matches: placed.filter(t => missing(t).length === 0),
        others: placed.map(t => ({ tool: t, missing: missing(t) })).filter(x => x.missing.length > 0),
      };
    });
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
    <div className="not-prose my-10 grid gap-4 text-skin-base">
      <div className="grid gap-5 rounded border border-skin-line bg-skin-card-muted p-5 sm:p-6">
        <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-x-10">
          <Choice label="Where should the agents run?" name="where" options={WHERE} value={where} onChange={v => setWhere(v)} chip={chip} />
          <Choice label="Which tools?" name="which" options={WHICH} value={which} onChange={v => setWhich(v)} chip={chip} />
        </div>

        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-4">
            <div className="text-xs uppercase tracking-wider opacity-70">What do you need?</div>
            {filtered && (
              <button type="button" onClick={reset} className="text-xs underline decoration-1 underline-offset-2 opacity-70 hover:opacity-100">
                Clear
              </button>
            )}
          </div>
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

      <div className="grid gap-4" aria-live="polite">
        {groups.map(g => (
          <div
            key={g.tier}
            role="region"
            id={`results-${g.tier}`}
            aria-label={TIER_LABEL[g.tier]}
            className="rounded border border-skin-line bg-skin-card-muted p-5 sm:p-6"
          >
            <div className="mb-2 flex items-baseline justify-between gap-4 border-b border-skin-line pb-2">
              <div role="heading" aria-level={3} className="text-base font-normal">
                {TIER_LABEL[g.tier]}
              </div>
              <div className="text-xs uppercase tracking-wider opacity-70">
                {g.matches.length} of {g.total} fit
              </div>
            </div>

            {g.matches.length === 0 ? (
              <p className="py-2 text-sm opacity-80">
                {g.total === 0
                  ? "None of these run there."
                  : "No tool here has pages that back everything you picked."}
              </p>
            ) : (
              <ul>
                {g.matches.map(t => (
                  <Row key={t.name} t={t} needs={needs} />
                ))}
              </ul>
            )}

            {g.others.length > 0 && (
              <details className="mt-2 border-t border-skin-line pt-3 text-sm">
                <summary className="cursor-pointer opacity-70">
                  {g.others.length === 1 ? "1 more" : `${g.others.length} more`}, and what their pages don't state
                </summary>
                <ul className="mt-2 grid gap-1">
                  {g.others.map(({ tool, missing }) => (
                    <li key={tool.name} className="opacity-75">
                      <span className="font-medium">{tool.name}:</span> {missing.map(m => SHORT[m].toLowerCase()).join(", ")}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
      </div>

      <p className="text-xs opacity-60">
        The majors and up-and-comers split is my own call. Stars are from GitHub on November 4, 2026. A tool counts only where its own pages say so, as of November 4, 2026. A missing tag means the pages didn't say, not that the tool can't.
      </p>
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
