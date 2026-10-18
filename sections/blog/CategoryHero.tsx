import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';
import type { Category } from '@/lib/blog';

export function CategoryHero({ category, count }: { category: Category; count: number }) {
  return (
    <section className="bg-surface py-16 sm:py-24">
      <Container className="flex flex-col gap-3">
        <Text variant="label">Kategoria</Text>
        <Heading level={1}>{category.label}</Heading>
        <Text>
          {count} {count === 1 ? 'artykuł' : count < 5 ? 'artykuły' : 'artykułów'}
        </Text>
      </Container>
    </section>
  );
}
