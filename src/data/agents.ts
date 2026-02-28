export const bio = {
  name: "Arach Tchoupani",
  location: "San Francisco / Montreal",
  summary: "Engineer, founder, builder. 15 years shipping product across 4 venture-backed companies. Currently building voice-first tools and exploring what happens when AI gives one person the leverage of twenty.",
  stats: { years: "15+", ventures: 4, exit: 1, raised: "$15M" },
};

export const career = [
  "Co-founded Breathe Life — InsurTech, acquired by Zinnia (2022)",
  "Engineering Manager at Meta — Creators, the blue app",
  "CTO at Primary.com — employee #2, built eng from zero",
  "4x CTO across venture-backed companies in NY and Montreal",
];

export const projects = [
  {
    name: "Talkie",
    href: "https://usetalkie.com",
    desc: "Native voice-to-action. Push-to-talk, on-device Whisper, multi-provider LLM routing.",
    stack: "Swift · SwiftUI · local Whisper · Claude/OpenAI/Groq",
  },
  {
    name: "HUD",
    href: "https://hud.arach.dev",
    desc: "Chrome-style UI components for canvas apps. Pan/zoom, panels, command palette, terminal drawer.",
    stack: "React · TypeScript · canvas rendering · component library",
  },
  {
    name: "Devmux",
    href: "https://devmux.arach.dev",
    desc: "Claude Code + dev server in tmux. Auto-detects stack, session persistence, menu bar companion.",
    stack: "Shell · tmux · Bun · macOS menu bar",
  },
  {
    name: "SpeakEasy",
    desc: "Unified TTS library. ElevenLabs, OpenAI, Groq, Gemini, system voices — one CLI.",
    stack: "TypeScript · Node.js · multi-provider abstraction",
  },
  {
    name: "Fabric",
    desc: "Agentic compute fabric. Isolated sandboxes for AI agents with snapshots and state persistence.",
    stack: "Kubernetes · Terraform · container orchestration",
  },
];

export const agents = [
  {
    name: "Author Portrait",
    href: "https://arach.io/agents/author-portrait",
    desc: "Parametric braille & ASCII portrait generator. Dithering, charset presets, copy-to-clipboard.",
  },
];

export const api = {
  base: "https://arach.io/api/v1",
  auth: "Bearer token via Authorization header",
  endpoints: [
    { method: "GET", path: "/ping", auth: "none", desc: "Health check" },
    { method: "POST", path: "/message", auth: "agent", desc: "Send a message" },
    { method: "GET", path: "/messages", auth: "admin", desc: "List messages" },
    { method: "GET", path: "/replies", auth: "agent", desc: "Poll for replies" },
    { method: "POST", path: "/reply", auth: "admin", desc: "Send a reply to an agent" },
  ],
  cli: "https://github.com/arach/arach.io/tree/main/cli",
};

export const tech = [
  { k: "languages", v: "TypeScript, Swift, Go, Rust, Python" },
  { k: "frontend", v: "React, Next.js, Astro, TailwindCSS, SwiftUI" },
  { k: "backend", v: "Node.js, Bun, Hono, PostgreSQL, Redis" },
  { k: "native", v: "Swift, Tauri v2, WebRTC, Whisper" },
  { k: "ai/ml", v: "Claude, OpenAI, Groq, Gemini, ElevenLabs, RLHF" },
  { k: "infra", v: "Kubernetes, Terraform, AWS, GCP, Vercel" },
];

export const accounts = [
  { name: "GitHub", handle: "@arach", href: "https://github.com/arach" },
  { name: "X / Twitter", handle: "@arach", href: "https://twitter.com/arach" },
  { name: "LinkedIn", handle: "in/arach", href: "https://linkedin.com/in/arach" },
  { name: "Instagram", handle: "@arach", href: "https://instagram.com/arach" },
  { name: "Email", handle: "arach@tchoupani.com", href: "mailto:arach@tchoupani.com" },
];

export const sites = [
  { name: "arach.io", href: "https://arach.io", desc: "Blog, resume, writing" },
  { name: "arach.dev", href: "https://arach.dev", desc: "Portfolio, specs, all projects" },
  { name: "usetalkie.com", href: "https://usetalkie.com", desc: "Talkie app" },
  { name: "hud.arach.dev", href: "https://hud.arach.dev", desc: "HUD components" },
  { name: "devmux.arach.dev", href: "https://devmux.arach.dev", desc: "Devmux" },
  { name: "tchoupani.com", href: "https://tchoupani.com", desc: "Personal" },
];
