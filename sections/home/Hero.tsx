import Image from 'next/image';
import { InkPanel } from '@/components/marketing/InkPanel';
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
    <section className="pt-4 md:pt-6">
      <Container>
        <InkPanel className="grid gap-14 px-6 pt-14 pb-10 sm:px-12 md:pt-20 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16 lg:px-16 lg:pt-24 lg:pb-16">
          <div className="flex flex-col gap-8 lg:pb-8">
            <Eyebrow inverse>{hero.eyebrow}</Eyebrow>
            <Heading as="h1" size="xl" inverse>
              <Accent text={hero.heading} />
            </Heading>
            <Text variant="lead" inverse className="max-w-xl">
              {hero.lead}
            </Text>
            <div className="flex flex-wrap gap-3">
              <Button href={booking.href} variant="light" arrow>
                {site.cta.label}
              </Button>
              <Button href="#jak-to-dziala" variant="ghost-light">
                Jak to działa
              </Button>
            </div>
            <dl className="mt-auto flex flex-wrap gap-x-10 gap-y-6 border-t border-background/10 pt-8">
              {facts.map((fact) => (
                <div key={fact.value} className="flex flex-col gap-1">
                  <dt className="font-serif text-title tracking-display text-background">
                    {fact.value}
                  </dt>
                  <dd className="text-xs text-inverse-muted">{fact.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-none lg:self-end">
            <div
              aria-hidden
              className="absolute inset-0 translate-x-3 -translate-y-3 rounded-t-arch rounded-b-3xl border border-accent-light/40"
            />
            <Image
              src={portrait.src}
              alt={portrait.alt}
              width={portrait.width}
              height={portrait.height}
              priority
              draggable={false}
              sizes="(min-width: 1024px) 460px, 90vw"
              className="relative aspect-4/5 w-full rounded-t-arch rounded-b-3xl object-cover"
            />
            <div className="absolute right-4 -bottom-4 left-4 flex items-center gap-4 rounded-2xl bg-background px-5 py-4 text-foreground shadow-card sm:right-auto sm:-left-8">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
                <GraduationCapIcon size={20} />
              </span>
              <div>
                <p className="text-sm font-medium">{credentials[0].title}</p>
                <p className="text-xs text-foreground-muted">
                  {credentials[1].title} · {hero.badge.detail}
                </p>
              </div>
            </div>
          </div>
        </InkPanel>
      </Container>
    </section>
  );
}
