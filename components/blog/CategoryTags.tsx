import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { getCategories } from '@/lib/blog';

export function CategoryTags({ active }: { active?: string }) {
  return (
    <nav aria-label="Kategorie">
      <ul className="flex flex-wrap gap-2">
        {getCategories().map((category) => (
          <li key={category.slug} className={category.slug === active ? 'opacity-60' : undefined}>
            <CategoryBadge category={category} />
          </li>
        ))}
      </ul>
    </nav>
  );
}
