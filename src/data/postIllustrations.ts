// Cyanotype sketches in /public/assets/illustrations/posts/<slug>.jpg.
// The classic template shows these in place of post thumbnails on listing pages.
export const POST_ILLUSTRATIONS = new Set([
  "introducing-linea",
  "infinite-margins",
  "2048ish-agentic-game-experiment",
  "ai-assisted-development-2025-update",
  "ai-restored-cto-personal-leverage",
  "ai-theater-vs-real-transformation",
  "api-for-the-ai-age",
  "infinite-bespoke-magic-paste-machine",
  "ladderless-path",
  "license-to-flatten",
  "my-first-npm-package-speakeasy",
  "my-new-blog-stack",
  "get-the-hang-of-ai-assisted-development",
  "the-lasting-impact-of-plaids-innovation",
  "voice-canvas-ai-exploration",
  "voice-first-development-workflow",
  "web-for-agents",
]);

export function postIllustration(href?: string): string | null {
  const slug = href?.split("/").filter(Boolean).pop();
  return slug && POST_ILLUSTRATIONS.has(slug)
    ? `/assets/illustrations/posts/${slug}.jpg`
    : null;
}
