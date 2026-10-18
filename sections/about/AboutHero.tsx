import Image from 'next/image';
import { ContactList } from '@/components/marketing/ContactList';
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
    <section className="pt-12 pb-20 md:pt-20 md:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
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
        <div className="flex flex-col gap-8 lg:order-1">
          <Eyebrow>O mnie</Eyebrow>
          <Heading as="h1" size="xl">
            <Accent text={about.heading} />
          </Heading>
          <Text variant="lead">{about.lead}</Text>
          <ContactList />
          <div>
            <Button href={site.booking.href} arrow>
              Zarezerwuj termin
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
