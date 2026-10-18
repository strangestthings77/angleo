import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function About() {
  const { about, offer } = site;

  return (
    <Section id="o-mnie" className="bg-surface">
      <Container className="grid gap-12 md:grid-cols-[2fr_3fr] md:gap-16">
        <div className="flex flex-col gap-5">
          <Heading level={2}>{about.heading}</Heading>
          {about.paragraphs.map((paragraph) => (
            <Text key={paragraph} variant="muted">
              {paragraph}
            </Text>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <Heading level={3}>{offer.heading}</Heading>
          <ul className="grid gap-4 sm:grid-cols-2">
            {offer.items.map((item) => (
              <li key={item.title} className="border-border bg-background rounded-2xl border p-6">
                <Heading level={4}>{item.title}</Heading>
                <Text variant="muted" className="mt-2">
                  {item.body}
                </Text>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
