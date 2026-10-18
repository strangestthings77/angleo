import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function Offer() {
  const { offer } = site;

  return (
    <Section>
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow={offer.eyebrow} heading={offer.heading} />
        <ol className="grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {offer.items.map((item, i) => (
            <li key={item.title} className="flex flex-col gap-10 bg-background p-8">
              <span className="font-serif text-display-sm text-accent tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-3">
                <h3 className="text-lg font-medium text-foreground">{item.title}</h3>
                <p className="text-sm/6 text-foreground-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
