import Image from 'next/image';
import { ContactList } from '@/components/marketing/ContactList';
import { InkPanel } from '@/components/marketing/InkPanel';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';

export function AboutHero() {
  const { about, portrait } = site;

  return (
    <section className="pt-4 md:pt-6">
      <Container>
        <InkPanel className="grid items-center gap-12 p-6 sm:p-12 lg:grid-cols-2 lg:gap-16 lg:p-16">
          <div className="flex flex-col gap-8 py-6 lg:order-1">
            <Eyebrow inverse>O mnie</Eyebrow>
            <Heading as="h1" size="xl" inverse>
              <Accent text={about.heading} />
            </Heading>
            <Text variant="lead" inverse>
              {about.lead}
            </Text>
            <ContactList inverse />
            <div>
              <Button href={site.booking.href} variant="light" arrow>
                Zarezerwuj termin
              </Button>
            </div>
          </div>
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            priority
            draggable={false}
            sizes="(min-width: 1024px) 560px, 100vw"
            className="aspect-4/5 w-full rounded-3xl object-cover lg:order-2"
          />
        </InkPanel>
      </Container>
    </section>
  );
}
