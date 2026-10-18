import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { About } from '@/sections/home/About';
import { Contact } from '@/sections/home/Contact';
import { Hero } from '@/sections/home/Hero';
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
      <About />
      <Topics />
      <Contact />
    </MainLayout>
  );
}
