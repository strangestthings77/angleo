import { Suspense } from 'react';
import { BookingWidget, WidgetSkeleton } from '@/components/booking/BookingWidget';
import { PageHero } from '@/components/marketing/PageHero';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { getViewer } from '@/lib/auth';
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
      <PageHero
        eyebrow={booking.pageEyebrow}
        heading={booking.pageHeading}
        lead={booking.pageLead}
        compact
      />
      <section className="pt-10 pb-section md:pt-14">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] lg:gap-16">
          <div className="order-2 lg:order-1">
            <LessonDetails />
          </div>
          <div
            id="rezerwacja"
            className="order-1 scroll-mt-24 rounded-3xl bg-surface p-5 shadow-card sm:p-10 lg:order-2"
          >
            <Suspense fallback={<WidgetSkeleton />}>
              <ViewerBookingWidget />
            </Suspense>
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}

/** Reads the session (if any) so signed-in students skip the name/email fields. */
async function ViewerBookingWidget() {
  const viewer = await getViewer();
  return <BookingWidget viewer={viewer ? { name: viewer.name, email: viewer.email } : null} />;
}
