import { BookingCta } from '@/components/marketing/BookingCta';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { AboutDetails } from '@/sections/about/AboutDetails';
import { AboutHero } from '@/sections/about/AboutHero';
import { Quote } from '@/sections/home/Quote';

export const metadata = buildMetadata({
  title: 'O mnie – Nicole Kurek | Angleo',
  description:
    'Poznaj Nicole Kurek – absolwentkę Filologii Angielskiej (Angielski w Biznesie, Media i Translacja) i trenerkę angielskiego dla profesjonalistów.',
  path: '/o-mnie',
});

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutHero />
      <AboutDetails />
      <div className="pt-section">
        <Quote />
      </div>
      <BookingCta />
    </MainLayout>
  );
}
