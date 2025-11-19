import { SITE } from "@config";
import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      thumbnail: image().or(z.string()).optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      readingTime: z.string().optional(),
      series: z.object({
        name: z.string(),
        order: z.number(),
      }).optional(),
      thumbnailCrop: z.object({
        // Legacy CSS-based positioning (still supported)
        x: z.string().optional(), // e.g., "left", "center", "right" or percentage/px
        y: z.string().optional(), // e.g., "top", "center", "bottom" or percentage/px
        width: z.string().optional(), // e.g., "100%"
        height: z.string().optional(), // e.g., "100%"

        // New intuitive API
        anchor: z.enum(["top", "center", "bottom", "left", "right"]).optional(), // Where to anchor the view
        shift: z.string().optional(), // Offset from anchor (e.g., "20%", "-10px")
        zoom: z.number().optional(), // Scale factor (e.g., 1.5 for 150%)
      }).optional(),
    }),
});

const book = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      addedDatetime: z.date(),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      author: z.string().default(SITE.author),
      description: z.string(),
      draft: z.boolean().optional(),
      isbn: z.string(),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      tags: z.array(z.string()).default(["others"]),
      title: z.string(),
      canonicalURL: z.string().optional(),
      featured: z.boolean().optional(),
      rating: z.number().optional(),
      readingTime: z.string().optional(),
      thumbnail: image().or(z.string()).optional(),
      goodreads: z.string().optional(),
      amazon: z.string().optional(),
    }),
});

const memo = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      authors: z.array(z.string()),
      pubDatetime: z.date(),
      addedDatetime: z.date(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
    }),
});

const til = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      draft: z.boolean().optional(),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      canonicalURL: z.string().optional(),
    }),
});

// Define posts collection to avoid deprecation warning
const posts = defineCollection({
  type: "content",
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      tags: z.array(z.string()).default(["others"]),
      description: z.string(),
      draft: z.boolean().optional(),
      ogImage: image()
        .refine(img => img.width >= 1200 && img.height >= 630, {
          message: "OpenGraph image must be at least 1200 X 630 pixels!",
        })
        .or(z.string())
        .optional(),
      canonicalURL: z.string().optional(),
    }),
});

export const collections = {
  blog: blog,
  book: book,
  memo: memo,
  til: til,
  posts: posts,
};
