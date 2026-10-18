import Link from 'next/link';
import type { Category } from '@/lib/blog';

type Variant = 'white' | 'grey' | 'plain';
const variants: Record<Variant, string> = {
  white: 'rounded-md bg-background px-4 py-3.5 text-sm/4 text-foreground sm:text-base/4.5',
  grey: 'rounded-md bg-surface px-3 py-2.5 text-xs/4 text-foreground hover:bg-border',
  plain: 'text-sm/5 text-foreground-muted',
};

export function CategoryBadge({
  category,
  variant = 'grey',
  link = true,
}: {
  category: Category;
  variant?: Variant;
  link?: boolean;
}) {
  const classes = `inline-block font-bold tracking-label uppercase ${variants[variant]}`;
  if (!link) return <span className={classes}>{category.label}</span>;
  return (
    <Link href={`/blog-post-categories/${category.slug}`} className={classes}>
      {category.label}
    </Link>
  );
}
