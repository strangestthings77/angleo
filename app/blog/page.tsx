import { FeaturedPost } from '@/components/blog/FeaturedPost';
import { PostGrid } from '@/components/blog/PostCard';
import { BookingCta } from '@/components/marketing/BookingCta';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { getFeaturedPost, getPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { BlogHeader } from '@/sections/blog/BlogHeader';

export const metadata = buildMetadata({
  title: 'Blog – angielski w pracy i biznesie | Angleo',
  description:
    'Praktyczne frazy, słownictwo i wskazówki: e-maile, spotkania, negocjacje, rozmowy o pracę i korpomowa po angielsku. Blog Nicole Kurek.',
  path: '/blog',
});

export default function BlogPage() {
  const featured = getFeaturedPost();
  const rest = getPosts().filter((post) => post.slug !== featured?.slug);

  return (
    <MainLayout>
      <BlogHeader eyebrow={site.blog.eyebrow} heading={site.blog.heading} lead={site.blog.lead} />
      <section className="py-section">
        <Container className="flex flex-col gap-20">
          {featured && <FeaturedPost post={featured} priority />}
          <PostGrid posts={rest} />
        </Container>
      </section>
      <BookingCta />
    </MainLayout>
  );
}
