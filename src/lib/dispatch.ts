import type { CollectionEntry } from 'astro:content';

/** Chronological dispatch number (001, 002, …) from oldest published post. */
export function getDispatchNumber(
  postId: string,
  posts: CollectionEntry<'blog'>[],
): string {
  const sorted = [...posts].sort(
    (a, b) => a.data.pubDate.getTime() - b.data.pubDate.getTime(),
  );
  const index = sorted.findIndex((post) => post.id === postId);
  return String(Math.max(index, 0) + 1).padStart(3, '0');
}
