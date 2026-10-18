import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { ContactDetails } from '@/sections/about/ContactDetails';

export const metadata = buildMetadata({
  title: 'Umów lekcję – Kontakt | Angleo',
  description:
    'Umów lekcję angielskiego z Nicole Kurek. Wybierz dogodny termin w kalendarzu albo napisz lub zadzwoń – odpowiem najszybciej, jak to możliwe.',
  path: '/umow-lekcje',
});

export default function ContactPage() {
  const { company } = site;

  return (
    <MainLayout>
      <Section>
        <Container className="grid gap-14 md:grid-cols-2 md:gap-16">
          <div className="flex flex-col gap-6">
            <Heading level={1}>Kontakt</Heading>
            <address className="flex flex-col gap-1 text-base/7 text-foreground-muted uppercase not-italic">
              <a
                href={company.linkedin}
                target="_blank"
                rel="noreferrer"
                className="font-bold text-foreground hover:text-foreground/70"
              >
                {site.owner}
              </a>
              <span>- {site.role}</span>
              <span>{company.street}</span>
              <span>{company.city}</span>
              <span>NIP: {company.nip}</span>
            </address>
            <Text variant="label" className="mt-4 text-foreground">
              Skontaktuj się:
            </Text>
            <ContactDetails />
          </div>
          <div className="flex flex-col items-start gap-6 self-start rounded-xl bg-surface p-8 sm:p-12">
            <Heading level={2}>Terminarz</Heading>
            <Text>Kliknij w poniższy przycisk i wybierz dogodny termin!</Text>
            <Button href={site.contact.calendarUrl}>Otwórz kalendarz</Button>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
