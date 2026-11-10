import Image from 'next/image';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { getLessonInfo } from '@/lib/cal';

export async function Hero() {
  const { hero, heroPortrait: portrait, booking } = site;
  const lesson = await getLessonInfo();

  const facts = [
    lesson && { value: `${lesson.lengthInMinutes} min`, label: 'lekcja 1:1 online' },
    { value: 'Google Meet', label: 'link w e-mailu' },
    { value: 'Filologia Angielska', label: 'Uniwersytet Śląski' },
  ].filter((fact): fact is { value: string; label: string } => Boolean(fact));

  return (
    <section className="overflow-hidden border-b border-border">
      <Container className="grid items-center gap-16 pt-14 pb-20 md:pt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 lg:pb-28">
        <div className="flex flex-col gap-8">
          <Eyebrow className="animate-rise">{hero.eyebrow}</Eyebrow>
          <Heading as="h1" size="xl" className="animate-rise rise-step-1">
            <Accent text={hero.heading} />
          </Heading>
          <Text variant="lead" className="max-w-xl animate-rise rise-step-2">
            {hero.lead}
          </Text>
          <div className="flex animate-rise flex-wrap gap-3 rise-step-3">
            <Button href={booking.href} arrow>
              {site.cta.label}
            </Button>
            <Button href="#jak-to-dziala" variant="secondary">
              Jak to działa
            </Button>
          </div>
          <dl className="mt-4 flex animate-rise flex-wrap gap-x-10 gap-y-6 border-t border-border pt-8 rise-step-4">
            {facts.map((fact) => (
              <div key={fact.value} className="flex flex-col gap-1">
                <dt className="font-serif text-title tracking-display text-foreground">
                  {fact.value}
                </dt>
                <dd className="text-xs text-foreground-muted">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative isolate mx-auto w-full max-w-xl animate-portrait rise-step-2 lg:mx-0 lg:max-w-none">
          {/* The photo is landscape and shown uncropped; the arch lives in the block behind it. */}
          <div
            aria-hidden
            className="absolute -inset-x-4 -top-12 bottom-10 -z-10 rounded-t-arch rounded-b-3xl bg-surface-muted sm:-inset-x-8 sm:-top-20"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 -translate-y-3 rounded-3xl border border-accent/40"
          />
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            priority
            quality={100}
            draggable={false}
            sizes="(min-width: 1024px) 600px, 90vw"
            className="relative h-auto w-full rounded-3xl shadow-card"
          />
          {hero.phrases.map((phrase, i) => (
            <figure
              key={phrase.en}
              aria-hidden
              className={`absolute flex max-w-56 animate-pop flex-col gap-1 rounded-2xl bg-surface px-4 py-3 shadow-card ${
                i === 0 ? 'rise-step-8' : i === 1 ? 'rise-step-10' : 'rise-step-6'
              } ${
                // Kept to the photo's edges and corners, clear of the face.
                i === 0
                  ? '-top-10 -left-2 rounded-bl-md sm:-left-10'
                  : i === 1
                    ? 'top-2/3 -right-3 rounded-br-md max-sm:hidden sm:-right-8'
                    : '-right-2 -bottom-10 rounded-tr-md sm:right-auto sm:-left-10'
              }`}
            >
              <span className="font-serif text-lg/6 text-foreground italic">{phrase.en}</span>
              <span className="text-xs text-foreground-muted">{phrase.pl}</span>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
