import type { MDXContent } from 'mdx/types';
import { categories } from '@/content/blog/categories';
import { featuredSlugs, popularSlugs, posts } from '@/content/blog/posts';

export type Category = { slug: string; label: string };

export type Post = {
  slug: string;
  title: string;
  category: string | null;
  /** ISO date, `YYYY-MM-DD`. */
  date: string;
  /** Card copy — full length. */
  excerpt: string;
  /** Meta description — trimmed to the 160-char audit limit. */
  description: string;
  cover: { src: string; width: number; height: number };
};

export const AUTHOR = 'Nicole Kurek';

export function getPosts(): Post[] {
  return posts;
}

export function getPost(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getCategories(): Category[] {
  return categories;
}

export function getCategory(slug: string | null): Category | undefined {
  return slug ? categories.find((category) => category.slug === slug) : undefined;
}

export function getPostsByCategory(slug: string): Post[] {
  return posts.filter((post) => post.category === slug);
}

const pick = (slugs: string[]) =>
  slugs.map((slug) => getPost(slug)).filter((post): post is Post => Boolean(post));

export function getFeaturedPosts(): Post[] {
  return pick(featuredSlugs);
}

export function getPopularPosts(): Post[] {
  return pick(popularSlugs);
}

export async function loadPostBody(slug: string): Promise<MDXContent> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return mod.default;
}

/** Matches the Webflow date format ("July 27, 2025"). */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Keeps `<title>` within the 60-char meta-audit limit. */
export function seoTitle(title: string, suffix = ' | Angleo'): string {
  const max = 60 - suffix.length;
  if (title.length <= max) return title + suffix;
  const cut = title
    .slice(0, max - 1)
    .replace(/\s+\S*$/, '')
    .replace(/[\s,;:–-]+$/, '');
  return `${cut}…${suffix}`;
}
