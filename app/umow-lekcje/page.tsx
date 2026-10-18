import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { ContactCards } from '@/sections/contact/ContactCards';

export const metadata = buildMetadata({
  title: 'Umów lekcję – Kontakt | Angleo',
  description:
    'Umów lekcję angielskiego z Nicole Kurek. Wybierz dogodny termin w kalendarzu albo napisz lub zadzwoń – odpowiem najszybciej, jak to możliwe.',
  path: '/umow-lekcje',
});

export default function ContactPage() {
  return (
    <MainLayout>
      <section className="pt-16 pb-12 md:pt-24 md:pb-16">
        <Container>
          <SectionHeader
            as="h1"
            size="xl"
            eyebrow="Kontakt"
            heading="Umów *lekcję.*"
            lead="Angielski w pracy i biznesie — dopasowany do sytuacji, w których naprawdę go używasz."
          />
        </Container>
      </section>
      <ContactCards />
    </MainLayout>
  );
}
