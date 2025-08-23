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
      serialize(item) {
        // Set default changefreq and priority
        item.changefreq = 'weekly';
        item.priority = 0.7;
        
        // Set higher priority for important pages
        if (item.url === SITE.website) {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (item.url.includes('/posts/') && !item.url.endsWith('/posts/')) {
          // Individual post pages
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (item.url.includes('/books/') && !item.url.endsWith('/books/')) {
          // Individual book pages
          item.priority = 0.6;
          item.changefreq = 'monthly';
        } else if (item.url.endsWith('/posts/') || item.url.endsWith('/books/') || item.url.endsWith('/tags/')) {
          // Archive pages
          item.priority = 0.9;
          item.changefreq = 'weekly';
        }
        
        // Add lastmod date (current build time for all pages)
        // In a real implementation, you might want to get this from git or file metadata
        item.lastmod = new Date().toISOString();
        
        return item;
      },
      // Optionally filter out certain pages
      filter: (page) => {
        // Exclude pagination pages except the first one
        if (page.includes('/posts/') && page.match(/\/\d+\/$/)) {
          return page.endsWith('/1/');
        }
        return true;
      }
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
  },
  scopedStyleStrategy: "where",
});
