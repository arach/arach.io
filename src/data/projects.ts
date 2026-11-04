// Projects introduced one at a time, in order. The last entry is the current one,
// and everything before it is on the way to it.
export interface Project {
  slug: string;
  name: string;
  kind: string;
  tagline: string;
  intro: string[];
  features: { name: string; desc: string }[];
  install: string;
  stack: string;
  site: string;
  repo: string;
  introduced: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "lattices",
    name: "Lattices",
    kind: "macOS workspace",
    tagline: "Tile windows, keep tmux sessions, search the screen, and drive the desktop from a local daemon.",
    intro: [
      "I work across a lot of projects at once, each with its own terminals, dev servers, browsers and agents. Lattices is the workspace manager I built so that all of it has a place: one hotkey to tile a window, one command to bring a project's sessions back exactly as I left them.",
      "It's a native Swift menu bar app paired with a TypeScript CLI. The app hosts a localhost WebSocket daemon, and the CLI, scripts and AI agents all talk to the same surface. Anything I can do with a keystroke, an agent can do with a call.",
    ],
    features: [
      { name: "Tile", desc: "Halves, quarters, thirds and grids from hotkeys, the CLI or the palette." },
      { name: "Sessions", desc: "A .lattices.json per project, with optional tmux that survives reattach." },
      { name: "Search", desc: "Window titles, apps, terminal cwd and an on-device OCR index of the screen." },
      { name: "Spaces", desc: "Instant Space switching and workspace layers on Cmd+Option+1/2/3." },
      { name: "Daemon", desc: "A localhost WebSocket API that agents and scripts can call." },
      { name: "Voice", desc: "Hold a key and speak to drive the desktop." },
    ],
    install: "npm install -g @arach/lattices",
    stack: "Swift · SwiftUI · AppKit · TypeScript · Vision · tmux",
    site: "https://lattices.dev",
    repo: "https://github.com/arach/lattices",
    introduced: "2026-10-07",
  },
  {
    slug: "scout",
    name: "Scout",
    kind: "AI agents as teammates",
    tagline: "Claude, Codex, Grok and the rest working with you as one team, with one record of who asked, who approved and what shipped.",
    intro: [
      "Everything I built on the way here was a piece of the same question: what does it take for AI agents to be teammates you can trust, not tabs you babysit? Talkie gave them my voice. Lattices gave them my desktop. Scout gives them each other, and a person to answer to.",
      "Agents from different vendors make different mistakes, so a mix of them beats betting on one. Scout lets them ask each other for work and check each other's output, while you set the direction and approve what matters. Every request, approval and result lands in one record you keep on your own hosts.",
    ],
    features: [
      { name: "Ask", desc: "Any agent can ask another for work and get the answer back, across vendors." },
      { name: "Review", desc: "Agents from different families check each other's work before you approve it." },
      { name: "Approve", desc: "You set the direction and sign off from your desk or your phone." },
      { name: "Record", desc: "Every request, approval and result in one record that stays on your hosts." },
      { name: "Reach", desc: "Agents on any of your hosts, reachable from anywhere you are." },
      { name: "Open", desc: "Open source. Keep your harness, your editor and your habits." },
    ],
    install: "bun add -g @openscout/scout",
    stack: "TypeScript · Bun · Swift · SwiftUI · MCP",
    site: "https://openscout.app",
    repo: "https://github.com/oscout/scout",
    introduced: "2026-10-23",
  },
];

export const currentProject = PROJECTS[PROJECTS.length - 1];

// The tools that led to the current project, in the order they mattered to it.
export const ON_THE_WAY = [
  {
    name: "Talkie",
    href: "https://usetalkie.com",
    kind: "Voice",
    desc: "Native voice-to-action on macOS. Where agents first got my voice.",
  },
  {
    name: "Devmux",
    href: "https://devmux.arach.dev",
    kind: "Sessions",
    desc: "Claude Code and dev servers together in tmux, so agent sessions survive.",
  },
  {
    name: "HUD",
    href: "https://hud.arach.dev",
    kind: "Interface",
    desc: "Canvas UI components for the tools I build around agents.",
  },
  {
    name: "Lattices",
    href: "/projects/lattices/",
    kind: "Desktop",
    desc: "A workspace daemon that agents can drive. Where they got my desktop.",
  },
  {
    name: "Linea",
    href: "https://lineareads.com",
    kind: "Reading",
    desc: "A reading app for reading alongside AI.",
  },
];
