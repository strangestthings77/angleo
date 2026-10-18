import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function Topics() {
  const { topics } = site;

  return (
    <Section id="tematy">
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Heading level={2}>{topics.heading}</Heading>
          <Text variant="muted">{topics.lead}</Text>
        </div>
        <ul className="flex flex-wrap gap-3">
          {topics.items.map((topic) => (
            <li
              key={topic}
              className="border-border bg-surface rounded-full border px-4 py-2 text-sm font-medium"
            >
              {topic}
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
