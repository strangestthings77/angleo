import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';

export function Contact() {
  const { contact } = site;

  return (
    <Section id="kontakt">
      <Container>
        <div className="bg-foreground text-background flex flex-col gap-8 rounded-3xl p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4">
            <Heading level={2}>{contact.heading}</Heading>
            <Text variant="inverse">{contact.lead}</Text>
            <ul className="flex flex-col gap-1 text-lg">
              <li>
                <a href={`mailto:${contact.email}`} className="underline-offset-4 hover:underline">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.phoneHref} className="underline-offset-4 hover:underline">
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
          <ButtonLink href={contact.calendarUrl} external>
            Otwórz kalendarz
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
