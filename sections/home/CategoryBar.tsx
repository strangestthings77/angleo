import { CategoryTags } from '@/components/blog/CategoryTags';
import { Container } from '@/components/ui/Container';

export function CategoryBar() {
  return (
    <div className="pt-12 sm:pt-16">
      <Container>
        <CategoryTags />
      </Container>
    </div>
  );
}
