import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { PostGrid } from '@/components/blog/PostCard';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';
import { getFeaturedPost, getPosts } from '@/lib/blog';

export function LatestPosts() {
  const featured = getFeaturedPost();
  const latest = getPosts()
    .filter((post) => post.slug !== featured?.slug)
    .slice(0, 3);

  return (
    <Section>
      <Container className="flex flex-col gap-16">
        <SectionHeader
          eyebrow={site.blog.eyebrow}
          heading={site.blog.heading}
          lead={site.blog.lead}
          action={
            <Button href="/blog" variant="secondary" arrow>
              Wszystkie artykuły
            </Button>
          }
        />
        {featured && <FeaturedPost post={featured} />}
        <PostGrid posts={latest} />
      </Container>
    </Section>
  );
}
