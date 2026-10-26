import { BookingCta } from '@/components/marketing/BookingCta';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { AboutTeaser } from '@/sections/home/AboutTeaser';
import { Audiences } from '@/sections/home/Audiences';
import { Faq } from '@/sections/home/Faq';
import { ExercisesPreview } from '@/sections/home/ExercisesPreview';
import { Hero } from '@/sections/home/Hero';
import { LatestPosts } from '@/sections/home/LatestPosts';
import { Offer } from '@/sections/home/Offer';
import { Process } from '@/sections/home/Process';
import { Specialties } from '@/sections/home/Specialties';

export const metadata = buildMetadata({
  title: site.title,
  description: site.description,
  path: '/',
});

export default function HomePage() {
  return (
    <MainLayout>
      <Hero />
      <Specialties />
      <Audiences />
      <Offer />
      <Process />
      <AboutTeaser />
      <LatestPosts />
      <ExercisesPreview />
      <Faq />
      <BookingCta />
    </MainLayout>
  );
}
