import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/config";
import { remarkReadingTime } from "./src/utils/remark-reading-time.mjs";
import partytown from "@astrojs/partytown";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";

// https://astro.build/config
export default defineConfig({
  site: SITE.website,
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    mdx(),
    sitemap({
      filter: (page) => {
        // Exclude utility/internal pages
        const excludePatterns = [
          '/og-preview',
          '/tactical-about-embed',
          '/search',
          '/resume',
          '/privacy',
        ];
        if (excludePatterns.some(pattern => page.includes(pattern))) {
          return false;
        }

        // Exclude ALL pagination pages (e.g., /posts/1/, /books/2/, /tags/ai/2/)
        if (page.match(/\/\d+\/?$/)) {
          return false;
        }

        // Exclude individual tag pages - they have low SEO value
        // Keep only /tags/ index
        if (page.includes('/tags/') && !page.endsWith('/tags/')) {
          return false;
        }

        return true;
      },
      serialize(item) {
        // Set priorities based on content type
        if (item.url === SITE.website) {
          item.priority = 1.0;
        } else if (item.url.endsWith('/posts/') || item.url.endsWith('/about/')) {
          item.priority = 0.9;
        } else if (item.url.includes('/posts/')) {
          // Individual blog posts - highest value content
          item.priority = 0.8;
        } else if (item.url.includes('/til/')) {
          item.priority = 0.7;
        } else if (item.url.includes('/books/') || item.url.includes('/memos/')) {
          item.priority = 0.6;
        } else {
          item.priority = 0.5;
        }

        return item;
      },
    }),
    partytown(),
    icon(),
  ],
  image: {
    // Example: Enable the Sharp-based image service with a custom config
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: false,
      },
    },
  },
  markdown: {
    remarkPlugins: [
      remarkToc,
      remarkReadingTime,
    ],
    shikiConfig: {
      theme: "monokai",
      wrap: true,
    },
  },
  vite: {
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"],
    },
    ssr: {
      noExternal: ["react-tweet"],
    },
  },
  scopedStyleStrategy: "where",
});
