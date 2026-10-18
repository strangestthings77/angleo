import Image from 'next/image';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function Hero() {
  const { hero, contact } = site;

  return (
    <Section>
      <Container className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-6">
          <p className="text-accent text-sm font-medium tracking-widest uppercase">
            {hero.eyebrow}
          </p>
          <Heading level={1}>{hero.heading}</Heading>
          <Text variant="lead">{hero.lead}</Text>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href={contact.calendarUrl} external>
              Umów lekcję
            </ButtonLink>
            <ButtonLink href="#kontakt" variant="secondary">
              Kontakt
            </ButtonLink>
          </div>
        </div>
        <Image
          src={hero.image.src}
          alt={hero.image.alt}
          width={hero.image.width}
          height={hero.image.height}
          priority
          draggable={false}
          sizes="(min-width: 768px) 50vw, 100vw"
          className="aspect-4/3 w-full rounded-3xl object-cover"
        />
      </Container>
    </Section>
  );
}
