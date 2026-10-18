import Image from 'next/image';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { GraduationCapIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function Hero() {
  const { hero, portrait, cta } = site;

  return (
    <section className="pt-12 pb-20 md:pt-20 md:pb-28">
      <Container className="grid items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
        <div className="flex flex-col gap-8">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <Heading as="h1" size="xl">
            <Accent text={hero.heading} />
          </Heading>
          <Text variant="lead" className="max-w-xl">
            {hero.lead}
          </Text>
          <div className="flex flex-wrap gap-3">
            <Button href={cta.href} arrow>
              {cta.label}
            </Button>
            <Button href="/blog" variant="secondary">
              Czytaj bloga
            </Button>
          </div>
        </div>
        <div className="relative">
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            priority
            draggable={false}
            sizes="(min-width: 1024px) 480px, 100vw"
            className="aspect-4/5 w-full rounded-t-arch rounded-b-3xl object-cover"
          />
          <div className="absolute -bottom-6 left-4 flex items-center gap-4 rounded-2xl bg-surface px-5 py-4 shadow-card sm:-left-8">
            <span className="flex size-10 items-center justify-center rounded-full bg-surface-muted text-accent">
              <GraduationCapIcon size={20} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{hero.badge.title}</p>
              <p className="text-xs text-foreground-muted">{hero.badge.detail}</p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
