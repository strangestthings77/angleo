import type { MDXContent } from 'mdx/types';
import { categories } from '@/content/blog/categories';
import { featuredSlug, posts } from '@/content/blog/posts';

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

export function getFeaturedPost(): Post | undefined {
  return getPost(featuredSlug);
}

export async function loadPostBody(slug: string): Promise<MDXContent> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return mod.default;
}

/** Polish long date, e.g. "27 lipca 2025". */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

/** Polish plural form: pluralForm(3, ['artykuł', 'artykuły', 'artykułów']) → "artykuły". */
export function pluralForm(n: number, [one, few, many]: [string, string, string]): string {
  const isFew = n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 12 || n % 100 > 14);
  return n === 1 ? one : isFew ? few : many;
}

/** plural(3, ['artykuł', 'artykuły', 'artykułów']) → "3 artykuły". */
export function plural(n: number, forms: [string, string, string]): string {
  return `${n} ${pluralForm(n, forms)}`;
}

export const articles = (n: number) => plural(n, ['artykuł', 'artykuły', 'artykułów']);

/** Same category first, then the newest others. */
export function getRelatedPosts(post: Post, count = 3): Post[] {
  const others = posts.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => post.category && p.category === post.category);
  return [...same, ...others.filter((p) => !same.includes(p))].slice(0, count);
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
