import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const flexDate = z
  .union([z.string(), z.date(), z.number()])
  .transform((value) => {
    if (value instanceof Date) return value;
    return new Date(String(value));
  });

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/data/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      author: z.string().default('Nick Thomas'),
      tags: z.array(z.string()).default([]),
      description: z.string(),
      pubDate: flexDate,
      imgUrl: z.union([image(), z.string()]).optional(),
      draft: z.boolean().optional().default(false),
    }),
});

export const collections = {
  blog: blogCollection,
};
