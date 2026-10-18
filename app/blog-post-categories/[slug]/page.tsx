import { notFound } from 'next/navigation';
import { PostGrid } from '@/components/blog/PostCard';
import { BookingCta } from '@/components/marketing/BookingCta';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { articles, getCategories, getCategory, getPostsByCategory, seoTitle } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { BlogHeader } from '@/sections/blog/BlogHeader';

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog-post-categories/[slug]'>) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  return buildMetadata({
    title: seoTitle(`${category.label} – angielski w pracy`),
    description: `Artykuły z kategorii ${category.label}: praktyczne frazy i wskazówki, jak używać angielskiego w pracy i biznesie.`,
    path: `/blog-post-categories/${category.slug}`,
  });
}

export default async function CategoryPage({ params }: PageProps<'/blog-post-categories/[slug]'>) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const posts = getPostsByCategory(category.slug);

  return (
    <MainLayout>
      <BlogHeader
        eyebrow={`Kategoria · ${articles(posts.length)}`}
        heading={`*${category.label}*`}
        lead={`Angielskie frazy i wskazówki z kategorii ${category.label} — gotowe do użycia w pracy.`}
        activeCategory={category.slug}
      />
      <section className="py-section">
        <Container>
          <PostGrid posts={posts} />
        </Container>
      </section>
      <BookingCta />
    </MainLayout>
  );
}
