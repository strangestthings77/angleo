import { PostGrid } from '@/components/blog/PostCard';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { getRelatedPosts, type Post } from '@/lib/blog';

export function RelatedPosts({ post }: { post: Post }) {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-14">
        <SectionHeader eyebrow="Czytaj dalej" heading="Więcej *z bloga*" />
        <PostGrid posts={getRelatedPosts(post)} />
      </Container>
    </Section>
  );
}
