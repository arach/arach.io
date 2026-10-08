// Projects introduced one at a time, in order. The last entry is the current one.
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
];

export const currentProject = PROJECTS[PROJECTS.length - 1];
