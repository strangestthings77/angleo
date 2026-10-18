import { notFound } from 'next/navigation';
import { PostFeed } from '@/components/blog/PostFeed';
import { MainLayout } from '@/layouts/MainLayout';
import { getCategories, getCategory, getPostsByCategory, seoTitle } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { CategoryHero } from '@/sections/blog/CategoryHero';

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
      <CategoryHero category={category} count={posts.length} />
      <PostFeed posts={posts} activeCategory={category.slug} />
    </MainLayout>
  );
}
