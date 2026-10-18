import Link from 'next/link';
import { getCategories } from '@/lib/blog';

const chip =
  'inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors duration-200';
const tones = {
  light: {
    idle: 'border-border text-foreground-muted hover:border-foreground/40 hover:text-foreground',
    current: 'border-foreground bg-foreground text-background',
  },
  inverse: {
    idle: 'border-background/20 text-inverse-muted hover:border-background/60 hover:text-background',
    current: 'border-background bg-background text-foreground',
  },
};

/** Filter row: "Wszystkie" + every category. `active` = category slug, or undefined for all. */
export function CategoryChips({ active, inverse = false }: { active?: string; inverse?: boolean }) {
  const { idle, current } = tones[inverse ? 'inverse' : 'light'];
  return (
    <nav aria-label="Kategorie">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/blog"
            aria-current={!active ? 'page' : undefined}
            className={`${chip} ${!active ? current : idle}`}
          >
            Wszystkie
          </Link>
        </li>
        {getCategories().map((category) => {
          const isActive = category.slug === active;
          return (
            <li key={category.slug}>
              <Link
                href={`/blog-post-categories/${category.slug}`}
                aria-current={isActive ? 'page' : undefined}
                className={`${chip} ${isActive ? current : idle}`}
              >
                {category.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
