import Image from 'next/image';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function AboutTeaser() {
  const { about, portrait, credentials, quote } = site;

  return (
    <Section>
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <Image
          src={portrait.src}
          alt={portrait.alt}
          width={portrait.width}
          height={portrait.height}
          draggable={false}
          sizes="(min-width: 1024px) 460px, 100vw"
          className="aspect-4/5 w-full rounded-3xl object-cover"
        />
        <div className="flex flex-col gap-8">
          <Eyebrow>O mnie</Eyebrow>
          <Heading size="lg">
            <Accent text={about.heading} />
          </Heading>
          <Text variant="lead">{about.education}</Text>
          <dl className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {credentials.map((item) => (
              <div key={item.title} className="flex flex-col gap-1 bg-background p-6">
                <dt className="font-serif text-title tracking-display text-foreground">
                  {item.title}
                </dt>
                <dd className="text-sm text-foreground-muted">{item.detail}</dd>
              </div>
            ))}
          </dl>
          <blockquote className="border-l-2 border-accent pl-6 font-serif text-title tracking-display text-foreground italic">
            „{quote.text}”
          </blockquote>
          <div>
            <Button href="/o-mnie" variant="secondary" arrow>
              Poznaj mnie
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
