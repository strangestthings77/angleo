import { notFound } from 'next/navigation';
import { Sidebar } from '@/components/blog/Sidebar';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MainLayout } from '@/layouts/MainLayout';
import { getPost, getPosts, loadPostBody, seoTitle } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { PostHero } from '@/sections/blog/PostHero';

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: seoTitle(post.title),
    description: post.description,
    path: `/blog/${post.slug}`,
    image: post.cover.src,
  });
}

export default async function PostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const Body = await loadPostBody(post.slug);

  return (
    <MainLayout>
      <PostHero post={post} />
      <Section>
        <Container className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <article className="lg:order-2">
            <Body />
          </article>
          <div className="lg:order-1">
            <Sidebar activeCategory={post.category ?? undefined} />
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
