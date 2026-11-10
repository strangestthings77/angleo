import { BookingCta } from '@/components/marketing/BookingCta';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { AboutDetails } from '@/sections/about/AboutDetails';
import { AboutHero } from '@/sections/about/AboutHero';
import { Quote } from '@/sections/home/Quote';
import { JsonLd } from '@/components/seo/JsonLd';
import { profileGraph } from '@/lib/structured-data';

export const metadata = buildMetadata({
  title: 'Nicole Kurek – trenerka angielskiego biznesowego | Angleo',
  description:
    'Nicole Kurek – absolwentka Filologii Angielskiej (Angielski w Biznesie, Uniwersytet Śląski). Prowadzi lekcje angielskiego biznesowego online 1:1.',
  path: '/o-mnie',
});

export default function AboutPage() {
  return (
    <MainLayout>
      <JsonLd data={profileGraph()} />
      <AboutHero />
      <AboutDetails />
      <div className="pt-section">
        <Quote />
      </div>
      <BookingCta />
    </MainLayout>
  );
}
