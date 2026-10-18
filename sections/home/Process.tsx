import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function Process() {
  const { process, booking, cta } = site;

  return (
    <Section id="jak-to-dziala" tone="muted">
      <Container className="flex flex-col gap-16">
        <SectionHeader
          eyebrow={process.eyebrow}
          heading={process.heading}
          action={
            <Button href={booking.href} arrow>
              {cta.label}
            </Button>
          }
        />
        <ol className="grid gap-12 md:grid-cols-3 md:gap-8">
          {process.steps.map((step, i) => (
            <li
              key={step.title}
              className="relative flex reveal flex-col gap-5 border-t border-foreground/15 pt-8"
            >
              <span
                aria-hidden
                className="absolute -top-1.5 left-0 size-3 rounded-full bg-accent"
              />
              <span className="font-serif text-display-md leading-none text-foreground/15 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="font-serif text-title tracking-display text-foreground">
                {step.title}
              </h3>
              <p className="text-sm/6 text-foreground-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
