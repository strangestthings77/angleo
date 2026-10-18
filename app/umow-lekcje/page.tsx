import { BookingWidget } from '@/components/booking/BookingWidget';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { LessonDetails } from '@/sections/contact/LessonDetails';

export const metadata = buildMetadata({
  title: 'Umów lekcję – rezerwacja online | Angleo',
  description:
    'Zarezerwuj lekcję angielskiego biznesowego z Nicole Kurek. Wybierz dzień i godzinę w kalendarzu – potwierdzenie i link do spotkania dostaniesz e-mailem.',
  path: '/umow-lekcje',
});

export default function BookingPage() {
  const { booking } = site;

  return (
    <MainLayout>
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <Container>
          <SectionHeader
            as="h1"
            size="xl"
            eyebrow={booking.pageEyebrow}
            heading={booking.pageHeading}
            lead={booking.pageLead}
          />
        </Container>
      </section>
      <section className="pb-section">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <LessonDetails />
          </div>
          <div
            id="rezerwacja"
            className="order-1 scroll-mt-24 rounded-3xl bg-surface p-5 shadow-card sm:p-10 lg:order-2"
          >
            <BookingWidget />
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
