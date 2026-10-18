import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function AboutDetails() {
  const { about, credentials, offer } = site;

  return (
    <Section tone="muted">
      <Container className="grid reveal gap-16 lg:grid-cols-2 lg:gap-24">
        <div className="flex flex-col gap-8">
          <Eyebrow>Wykształcenie</Eyebrow>
          <Heading size="md">
            Filologia Angielska, <em>Uniwersytet Śląski</em>
          </Heading>
          <Text variant="lead">{about.education}</Text>
          <ul className="flex flex-col divide-y divide-border border-y border-border">
            {credentials.map((item) => (
              <li key={item.title} className="flex flex-col gap-1 py-6">
                <span className="font-serif text-title tracking-display text-foreground">
                  {item.title}
                </span>
                <span className="text-sm text-foreground-muted">{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-8">
          <Eyebrow>Co znajdziesz na blogu?</Eyebrow>
          <ul className="flex flex-col gap-4">
            {offer.items.map((item, i) => (
              <li key={item.title} className="flex gap-6 rounded-2xl bg-background p-6">
                <span className="font-serif text-title text-accent tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-1">
                  <h3 className="font-medium text-foreground">{item.title}</h3>
                  <p className="text-sm/6 text-foreground-muted">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <Text>{about.closing}</Text>
        </div>
      </Container>
    </Section>
  );
}
