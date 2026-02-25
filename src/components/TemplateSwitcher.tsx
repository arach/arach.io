import { useState, useEffect, useRef } from "react";

type Template = "docs" | "terminal" | "industrial";

const templates: { id: Template; label: string; icon: string }[] = [
  { id: "docs", label: "Docs", icon: "doc" },
  { id: "terminal", label: "Terminal", icon: ">" },
  { id: "industrial", label: "Industrial", icon: "◆" },
];

export default function TemplateSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [current, setCurrent] = useState<Template>("docs");
  const [isDark, setIsDark] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("site-template") as Template) || "docs";
    setCurrent(saved);
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

  const applyTemplate = (id: Template) => {
    const html = document.documentElement;
    html.setAttribute("data-template", id);
    localStorage.setItem("site-template", id);
    setCurrent(id);

    if (id === "terminal" || id === "industrial") {
      html.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
      window.dispatchEvent(
        new CustomEvent("theme-change", { detail: { isDark: true } })
      );
    }

    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    if (current !== "docs") return;
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.setAttribute(
      "data-theme",
      newDark ? "dark" : "light"
    );
    localStorage.setItem("theme", newDark ? "dark" : "light");
    window.dispatchEvent(
      new CustomEvent("theme-change", { detail: { isDark: newDark } })
    );
  };

  return (
    <div ref={panelRef} className="fixed bottom-4 right-4 z-[999]">
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="template-switcher-btn"
        aria-label="Switch template"
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)",
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          transition: "all 0.2s",
          fontSize: "14px",
          color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            minWidth: "180px",
            borderRadius: "12px",
            border: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
            background: isDark ? "rgba(24,24,27,0.95)" : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            boxShadow: isDark
              ? "0 8px 32px rgba(0,0,0,0.4)"
              : "0 8px 32px rgba(0,0,0,0.12)",
            padding: "6px",
            animation: "tmplFadeIn 0.15s ease-out",
          }}
        >
          {/* Template options */}
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => applyTemplate(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "none",
                background:
                  current === t.id
                    ? isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.05)"
                    : "transparent",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: current === t.id ? 500 : 400,
                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
                textAlign: "left",
                transition: "background 0.15s",
              }}
              onMouseEnter={e => {
                if (current !== t.id) {
                  (e.target as HTMLElement).style.background = isDark
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,0,0,0.03)";
                }
              }}
              onMouseLeave={e => {
                if (current !== t.id) {
                  (e.target as HTMLElement).style.background = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "11px", opacity: 0.5, fontFamily: "monospace", width: "18px", textAlign: "center" }}>
                {t.icon}
              </span>
              <span>{t.label}</span>
              {current === t.id && (
                <span style={{ marginLeft: "auto", fontSize: "8px", opacity: 0.5 }}>
                  ●
                </span>
              )}
            </button>
          ))}

          {/* Divider */}
          <div
            style={{
              height: "1px",
              margin: "4px 8px",
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            }}
          />

          {/* Dark mode toggle (only for docs) */}
          <button
            onClick={toggleDarkMode}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              width: "100%",
              padding: "8px 12px",
              borderRadius: "8px",
              border: "none",
              background: "transparent",
              cursor: current === "docs" ? "pointer" : "not-allowed",
              fontSize: "13px",
              color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              textAlign: "left",
              opacity: current === "docs" ? 1 : 0.4,
              transition: "background 0.15s",
            }}
          >
            <span style={{ fontSize: "11px", fontFamily: "monospace", width: "18px", textAlign: "center" }}>
              {isDark ? "☽" : "☀"}
            </span>
            <span>{isDark ? "Dark" : "Light"}</span>
            {current !== "docs" && (
              <span style={{ marginLeft: "auto", fontSize: "10px", opacity: 0.5 }}>
                locked
              </span>
            )}
          </button>
        </div>
      )}

      <style>{`
        @keyframes tmplFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
