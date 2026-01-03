import { SITE } from "@config";
import type { CollectionEntry } from "astro:content";

// Tactical monospace theme for TILs
const theme = {
  background: "#0a0a0a",
  cyan: "rgba(0,255,209,1)",
  cyanMuted: "rgba(0,255,209,0.8)",
  cyanLight: "rgba(0,255,209,0.05)",
  cyanBorder: "rgba(0,255,209,0.2)",
  white: "rgba(255,255,255,1)",
  whiteMuted: "rgba(255,255,255,0.7)",
  whiteLight: "rgba(255,255,255,0.5)",
  amber: "#FBB024",
  amberMuted: "rgba(251,176,36,0.8)",
};

const sanitizeText = (text: any): string => {
  if (!text) return '';
  const str = String(text);
  return str
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[\u200B-\u200D\uFEFF]/g, '');
};

export default (til: CollectionEntry<"til">) => {
  const tags = Array.isArray(til.data.tags)
    ? til.data.tags.filter(tag => typeof tag === 'string' && tag.length > 0).slice(0, 3)
    : [];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: theme.background,
        padding: "40px 48px",
        fontFamily: "'Space Mono', monospace",
      }}
    >
      {/* Header bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "11px",
          fontFamily: "'Space Mono', monospace",
          color: theme.whiteLight,
          fontWeight: 600,
          letterSpacing: "0.1em",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ color: theme.amber, fontSize: "14px" }}>TIL</span>
          <span style={{ color: theme.whiteLight }}>TODAY I LEARNED</span>
        </div>
        <span>ARACH.IO</span>
      </div>

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          justifyContent: "center",
        }}
      >
        {/* Title */}
        <h1
          style={{
            fontSize: til.data.title.length > 50 ? "44px" : "52px",
            fontWeight: "700",
            color: theme.white,
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
            margin: 0,
            fontFamily: "'Space Mono', monospace",
            marginBottom: "24px",
          }}
        >
          {sanitizeText(til.data.title)}
        </h1>

        {/* Description */}
        {til.data.description && (
          <p
            style={{
              fontSize: "18px",
              color: theme.whiteMuted,
              lineHeight: 1.5,
              margin: 0,
              fontFamily: "'Space Mono', monospace",
              maxWidth: "90%",
            }}
          >
            {sanitizeText(til.data.description)}
          </p>
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginTop: "auto",
        }}
      >
        {/* Tags */}
        <div style={{ display: "flex", gap: "10px" }}>
          {tags.map((tag, i) => (
            <span
              key={i}
              style={{
                color: theme.cyanMuted,
                fontSize: "12px",
                fontWeight: "600",
                fontFamily: "'Space Mono', monospace",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              [{sanitizeText(tag)}]
            </span>
          ))}
        </div>

        {/* Date */}
        {til.data.pubDatetime && (
          <span
            style={{
              fontSize: "12px",
              color: theme.whiteLight,
              fontFamily: "'Space Mono', monospace",
            }}
          >
            {new Date(til.data.pubDatetime).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }).toUpperCase()}
          </span>
        )}
      </div>
    </div>
  );
};
