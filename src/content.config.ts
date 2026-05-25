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
  schema: () =>
    z.object({
      title: z.string(),
      author: z.string().default('Nick Thomas'),
      tags: z.array(z.string()).default([]),
      description: z.string(),
      pubDate: flexDate,
      imgUrl: z.string().optional(),
      draft: z.boolean().optional().default(false),
    }),
});

const homeCollection = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/data/home' }),
  schema: () =>
    z.object({
      description: z.string(),
      transmissionKicker: z.string().default('Transmission // 01'),
      nameHighlight: z.string(),
      nameLine2: z.string(),
      tagline: z.string(),
      heroButtonLabel: z.string().default('Read the dispatches →'),
      heroButtonHref: z.string().default('/blog/'),
      manifestAnchorLabel: z.string().default('Manifest'),
      manifestKicker: z.string().default('Manifest'),
      manifestTitle: z.string(),
      manifestTitleHighlight: z.string().optional(),
    }),
});

export const collections = {
  blog: blogCollection,
  home: homeCollection,
};
