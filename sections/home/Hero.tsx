import Image from 'next/image';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { GraduationCapIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';
import { getLessonInfo } from '@/lib/cal';

export async function Hero() {
  const { hero, portrait, booking, credentials } = site;
  const lesson = await getLessonInfo();

  const facts = [
    lesson && { value: `${lesson.lengthInMinutes} min`, label: 'lekcja 1:1 online' },
    { value: 'Google Meet', label: 'link w e-mailu' },
    { value: 'Filologia Angielska', label: 'Uniwersytet Śląski' },
  ].filter((fact): fact is { value: string; label: string } => Boolean(fact));

  return (
    <section className="overflow-hidden border-b border-border">
      <Container className="grid items-center gap-16 pt-14 pb-20 md:pt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20 lg:pb-28">
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

        <div className="relative isolate mx-auto w-full max-w-md animate-portrait rise-step-2 lg:mx-0 lg:max-w-none">
          {/* Soft arch block + brass outline behind the portrait. */}
          <div
            aria-hidden
            className="absolute -inset-x-6 -top-6 bottom-12 -z-10 rounded-t-arch rounded-b-3xl bg-surface-muted sm:-inset-x-10"
          />
          <div
            aria-hidden
            className="absolute inset-0 translate-x-3 -translate-y-3 rounded-t-arch rounded-b-3xl border border-accent/40"
          />
          <Image
            src={portrait.src}
            alt={portrait.alt}
            width={portrait.width}
            height={portrait.height}
            priority
            quality={90}
            draggable={false}
            sizes="(min-width: 1024px) 460px, 90vw"
            className="relative aspect-4/5 w-full rounded-t-arch rounded-b-3xl object-cover shadow-card"
          />
          {hero.phrases.map((phrase, i) => (
            <figure
              key={phrase.en}
              aria-hidden
              className={`absolute flex max-w-56 animate-pop flex-col gap-1 rounded-2xl bg-surface px-4 py-3 shadow-card ${i === 0 ? 'rise-step-8' : 'rise-step-10'} ${
                i === 0
                  ? '-top-8 -left-1 rounded-bl-md sm:top-10 sm:-left-12'
                  : 'top-1/2 -right-3 hidden rounded-br-md sm:-right-10 sm:flex'
              }`}
            >
              <span className="font-serif text-lg/6 text-foreground italic">{phrase.en}</span>
              <span className="text-xs text-foreground-muted">{phrase.pl}</span>
            </figure>
          ))}
          <div className="absolute right-4 -bottom-6 left-4 flex animate-pop items-center gap-4 rounded-2xl bg-surface px-5 py-4 shadow-card rise-step-6 sm:right-auto sm:-left-8">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
              <GraduationCapIcon size={20} />
            </span>
            <div>
              <p className="text-sm font-medium text-foreground">{credentials[0].title}</p>
              <p className="text-xs text-foreground-muted">
                {credentials[1].title} · {hero.badge.detail}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
