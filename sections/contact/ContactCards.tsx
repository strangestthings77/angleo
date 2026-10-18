import { ContactList } from '@/components/marketing/ContactList';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CalendarIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function ContactCards() {
  const { contact, company } = site;

  return (
    <section className="pb-section">
      <Container className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="flex flex-col justify-between gap-12 overflow-hidden rounded-3xl bg-foreground p-8 sm:p-12">
          <div className="flex flex-col gap-5">
            <Eyebrow inverse>Terminarz</Eyebrow>
            <Heading size="md" inverse>
              Wybierz <em>dogodny termin</em>
            </Heading>
            <Text variant="lead" inverse className="max-w-md">
              Kliknij w poniższy przycisk i wybierz dogodny termin!
            </Text>
          </div>
          <div>
            <Button href={contact.calendarUrl} variant="light">
              <CalendarIcon />
              Otwórz kalendarz
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-8">
            <Eyebrow>Skontaktuj się</Eyebrow>
            <ContactList />
          </div>
          <address className="flex flex-col gap-1 rounded-3xl border border-border p-8 text-sm/6 text-foreground-muted not-italic">
            <a
              href={company.linkedin}
              target="_blank"
              rel="noreferrer"
              className="mb-2 font-serif text-title tracking-display text-foreground hover:text-accent"
            >
              {site.owner}
            </a>
            <span>{site.role}</span>
            <span>{company.street}</span>
            <span>{company.city}</span>
            <span>NIP: {company.nip}</span>
          </address>
        </div>
      </Container>
    </section>
  );
}
