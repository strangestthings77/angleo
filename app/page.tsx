import { BookingCta } from '@/components/marketing/BookingCta';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { Credentials } from '@/sections/home/Credentials';
import { Hero } from '@/sections/home/Hero';
import { LatestPosts } from '@/sections/home/LatestPosts';
import { Offer } from '@/sections/home/Offer';
import { Quote } from '@/sections/home/Quote';
import { Topics } from '@/sections/home/Topics';

export const metadata = buildMetadata({
  title: site.title,
  description: site.description,
  path: '/',
});

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Credentials />
      <Offer />
      <Topics />
      <LatestPosts />
      <Quote />
      <BookingCta />
    </MainLayout>
  );
}
