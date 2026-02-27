import { useState, useEffect, useRef } from "react";

interface Post {
  slug: string;
  title: string;
}

interface AgentViewProps {
  posts: Post[];
}

const arachDevResources = [
  { label: "Homepage", url: "https://arach.dev" },
  { label: "Agent Specs Index", url: "https://arach.dev/agents" },
  { label: "Arach Agent Spec", url: "https://arach.dev/agents/arach" },
];

export default function AgentView({ posts }: AgentViewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");

    const handleThemeChange = (e: CustomEvent) => {
      setIsDark(e.detail.isDark);
    };
    window.addEventListener("theme-change" as any, handleThemeChange);

    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);

    return () => {
      window.removeEventListener("theme-change" as any, handleThemeChange);
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopiedUrl(url);
      setTimeout(() => setCopiedUrl(null), 1500);
    }
  };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const linkRowStyle = (url: string): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "6px",
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "12px",
    fontFamily: "'IBM Plex Mono', monospace",
    color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    background: copiedUrl === url
      ? isDark ? "rgba(129,140,248,0.15)" : "rgba(99,102,241,0.08)"
      : "transparent",
    transition: "background 0.15s",
  });

  const copyBtnStyle: React.CSSProperties = {
    flexShrink: 0,
    padding: "2px 6px",
    borderRadius: "3px",
    border: "1px solid",
    borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
    background: "transparent",
    cursor: "pointer",
    fontSize: "10px",
    fontFamily: "'IBM Plex Mono', monospace",
    color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
    transition: "all 0.15s",
  };

  const sectionTitleStyle: React.CSSProperties = {
    fontSize: "10px",
    fontFamily: "'IBM Plex Sans', sans-serif",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    color: isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)",
    padding: "8px 8px 4px",
  };

  return (
    <div ref={panelRef} style={{ position: "fixed", bottom: "3rem", right: "1rem", zIndex: 997 }}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Agent view"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "4px",
          height: "36px",
          padding: "0 10px",
          borderRadius: "18px",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          fontSize: "11px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontWeight: 500,
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
          transition: "all 0.2s",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
        <span>Agent</span>
      </button>

      {/* Panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            width: "320px",
            maxHeight: "420px",
            overflowY: "auto",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            background: isDark ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.12)",
            padding: "6px",
            animation: "agentFadeIn 0.15s ease-out",
          }}
        >
          {/* arach.io section */}
          <div style={sectionTitleStyle}>arach.io</div>

          {/* Sitemap & RSS */}
          <div style={linkRowStyle(`${baseUrl}/rss.xml`)}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              /rss.xml
            </span>
            <button style={copyBtnStyle} onClick={() => copyUrl(`${baseUrl}/rss.xml`)}>
              {copiedUrl === `${baseUrl}/rss.xml` ? "Copied" : "Copy"}
            </button>
          </div>
          <div style={linkRowStyle(`${baseUrl}/sitemap-index.xml`)}>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              /sitemap-index.xml
            </span>
            <button style={copyBtnStyle} onClick={() => copyUrl(`${baseUrl}/sitemap-index.xml`)}>
              {copiedUrl === `${baseUrl}/sitemap-index.xml` ? "Copied" : "Copy"}
            </button>
          </div>

          {/* Divider */}
          <div style={{
            height: "1px",
            margin: "4px 8px",
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          }} />

          {/* Blog posts */}
          <div style={{ ...sectionTitleStyle, paddingTop: "4px" }}>Posts</div>
          {posts.map(post => {
            const url = `${baseUrl}/posts/${post.slug}/`;
            return (
              <div key={post.slug} style={linkRowStyle(url)}>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={post.title}>
                  /posts/{post.slug}/
                </span>
                <button style={copyBtnStyle} onClick={() => copyUrl(url)}>
                  {copiedUrl === url ? "Copied" : "Copy"}
                </button>
              </div>
            );
          })}

          {/* Divider */}
          <div style={{
            height: "1px",
            margin: "4px 8px",
            background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
          }} />

          {/* arach.dev section */}
          <div style={sectionTitleStyle}>arach.dev</div>
          {arachDevResources.map(resource => (
            <div key={resource.url} style={linkRowStyle(resource.url)}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={resource.label}>
                {resource.label}
              </span>
              <button style={copyBtnStyle} onClick={() => copyUrl(resource.url)}>
                {copiedUrl === resource.url ? "Copied" : "Copy"}
              </button>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes agentFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
