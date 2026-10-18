import { notFound } from 'next/navigation';
import { BookingCta } from '@/components/marketing/BookingCta';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { getPost, getPosts, loadPostBody, seoTitle } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { ArticleHeader } from '@/sections/blog/ArticleHeader';
import { AuthorBox } from '@/sections/blog/AuthorBox';
import { RelatedPosts } from '@/sections/blog/RelatedPosts';

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
      <article>
        <ArticleHeader post={post} />
        <Container className="py-section">
          <div className="mx-auto max-w-reading">
            <Body />
            <div className="mt-16">
              <AuthorBox />
            </div>
          </div>
        </Container>
      </article>
      <RelatedPosts post={post} />
      <div className="pt-section">
        <BookingCta />
      </div>
    </MainLayout>
  );
}
