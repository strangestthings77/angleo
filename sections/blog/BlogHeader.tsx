import { CategoryChips } from '@/components/blog/CategoryChips';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';

/** Shared header for /blog and category pages. */
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
    <section className="pt-16 pb-12 md:pt-24 md:pb-16">
      <Container className="flex flex-col gap-12">
        <SectionHeader as="h1" size="lg" eyebrow={eyebrow} heading={heading} lead={lead} />
        <CategoryChips active={activeCategory} />
      </Container>
    </section>
  );
}
