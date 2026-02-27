import { useState, useEffect, useRef } from "react";

type Template = "classic" | "terminal" | "industrial";

const templates: { id: Template; label: string; icon: string }[] = [
  { id: "classic", label: "Classic", icon: "○" },
  { id: "terminal", label: "Terminal", icon: ">" },
  { id: "industrial", label: "Industrial", icon: "◆" },
];

export default function BottomToolbar() {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [current, setCurrent] = useState<Template>("classic");
  const [isDark, setIsDark] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let saved = (localStorage.getItem("site-template") as Template) || "classic";
    if (saved === ("docs" as any)) {
      saved = "classic";
      localStorage.setItem("site-template", "classic");
    }
    setCurrent(saved);
    setIsDark(document.documentElement.getAttribute("data-theme") === "dark");

    const onTheme = (e: CustomEvent) => setIsDark(e.detail.isDark);
    window.addEventListener("theme-change" as any, onTheme);

    const observer = new MutationObserver(() => {
      const t = document.documentElement.getAttribute("data-template") as Template;
      if (t) setCurrent(t);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-template"] });

    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPickerOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      window.removeEventListener("theme-change" as any, onTheme);
      document.removeEventListener("mousedown", onClickOutside);
      observer.disconnect();
    };
  }, []);

  const applyTemplate = (id: Template) => {
    document.documentElement.setAttribute("data-template", id);
    localStorage.setItem("site-template", id);
    setCurrent(id);
    setPickerOpen(false);
  };

  const toggleDarkMode = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.setAttribute("data-theme", newDark ? "dark" : "light");
    localStorage.setItem("theme", newDark ? "dark" : "light");
    window.dispatchEvent(new CustomEvent("theme-change", { detail: { isDark: newDark } }));
  };

  const toggleAgent = () => {
    if (current === "terminal") {
      const prev = (localStorage.getItem("site-template-prev") as Template) || "classic";
      applyTemplate(prev);
    } else {
      localStorage.setItem("site-template-prev", current);
      applyTemplate("terminal");
    }
  };

  const isTerminal = current === "terminal";
  const border = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const bg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const fg = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const fgActive = isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)";
  const activeBg = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const dividerColor = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const itemBase: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
    height: "100%",
    padding: "0 10px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "11px",
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 500,
    color: fg,
    transition: "color 0.15s, background 0.15s",
    whiteSpace: "nowrap",
    borderRadius: 0,
  };

  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        bottom: "12px",
        right: "12px",
        zIndex: 999,
      }}
    >
      {/* Main bar — always in place, never moves */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "32px",
          borderRadius: "8px",
          border: `1px solid ${border}`,
          background: isDark ? "rgba(24,24,27,0.92)" : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(16px)",
          boxShadow: isDark
            ? "0 2px 12px rgba(0,0,0,0.3)"
            : "0 2px 12px rgba(0,0,0,0.08)",
          overflow: "visible",
          position: "relative",
        }}
      >
        {/* Template name — click to toggle picker */}
        <button
          onClick={() => setPickerOpen(!pickerOpen)}
          aria-label="Template picker"
          style={{
            ...itemBase,
            borderRadius: "7px 0 0 7px",
            background: pickerOpen ? activeBg : "transparent",
          }}
        >
          {templates.find(t => t.id === current)?.label ?? "Classic"}
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: dividerColor, flexShrink: 0 }} />

        {/* Dark/light toggle */}
        <button
          onClick={toggleDarkMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            ...itemBase,
            padding: "0 8px",
            fontSize: "13px",
          }}
        >
          {isDark ? "☽" : "☀"}
        </button>

        {/* Divider */}
        <div style={{ width: "1px", height: "16px", background: dividerColor, flexShrink: 0 }} />

        {/* Agent button */}
        <button
          onClick={toggleAgent}
          aria-label="Toggle agent view"
          style={{
            ...itemBase,
            borderRadius: "0 7px 7px 0",
            background: isTerminal ? activeBg : "transparent",
            color: isTerminal ? fgActive : fg,
            fontWeight: isTerminal ? 600 : 500,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill={isTerminal ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
          Agent
        </button>
      </div>

      {/* Expanded picker — absolutely positioned above, anchored right */}
      {pickerOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            right: 0,
            display: "flex",
            alignItems: "center",
            gap: "2px",
            height: "32px",
            padding: "0 4px",
            borderRadius: "8px",
            border: `1px solid ${border}`,
            background: isDark ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 4px 16px rgba(0,0,0,0.4)"
              : "0 4px 16px rgba(0,0,0,0.1)",
            animation: "btPickerIn 0.15s ease-out",
          }}
        >
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.id)}
              aria-label={`Switch to ${t.label} template`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                height: "24px",
                padding: "0 10px",
                borderRadius: "5px",
                border: "none",
                background: current === t.id ? activeBg : "transparent",
                cursor: "pointer",
                fontSize: "11px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontWeight: current === t.id ? 600 : 400,
                color: current === t.id ? fgActive : fg,
                transition: "all 0.15s",
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontFamily: "monospace", fontSize: "10px", opacity: 0.6 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes btPickerIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
