import { PostFeed } from '@/components/blog/PostFeed';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { getPosts } from '@/lib/blog';
import { buildMetadata } from '@/lib/metadata';
import { CategoryBar } from '@/sections/home/CategoryBar';
import { HomeHero } from '@/sections/home/HomeHero';

export const metadata = buildMetadata({
  title: site.title,
  description: site.description,
  path: '/',
});

export default function HomePage() {
  return (
    <MainLayout>
      <h1 className="sr-only">{site.title}</h1>
      <HomeHero />
      <CategoryBar />
      <PostFeed posts={getPosts()} />
    </MainLayout>
  );
}
