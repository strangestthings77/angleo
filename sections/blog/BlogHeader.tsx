import { CategoryChips } from '@/components/blog/CategoryChips';
import { PageHero } from '@/components/marketing/PageHero';

/** Shared ink header for /blog and category pages. */
export function BlogHeader({
  eyebrow,
  heading,
  lead,
  activeCategory,
}: {
  eyebrow: string;
  heading: string;
  lead: string;
  activeCategory?: string;
}) {
  return (
    <PageHero eyebrow={eyebrow} heading={heading} lead={lead}>
      <CategoryChips active={activeCategory} />
    </PageHero>
  );
}
