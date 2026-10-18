import { ContactList } from '@/components/marketing/ContactList';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CalendarIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

/** Ink band that closes most pages. */
export function BookingCta() {
  const { booking, contact } = site;

  return (
    <section className="pb-section">
      <Container>
        <div className="overflow-hidden rounded-4xl bg-foreground px-6 py-16 sm:px-12 md:py-20 lg:px-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-end">
            <div className="flex flex-col gap-6">
              <Eyebrow inverse>{booking.eyebrow}</Eyebrow>
              <Heading size="lg" inverse>
                <Accent text={booking.heading} />
              </Heading>
              <Text variant="lead" inverse className="max-w-xl">
                {booking.lead}
              </Text>
            </div>
            <div className="flex flex-col gap-8 lg:items-end">
              <Button href={contact.calendarUrl} variant="light" className="w-full sm:w-auto">
                <CalendarIcon />
                Otwórz kalendarz
              </Button>
              <div className="lg:text-right">
                <ContactList inverse />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
