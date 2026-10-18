import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { MainLayout } from '@/layouts/MainLayout';

export default function NotFound() {
  return (
    <MainLayout>
      <Section>
        <Container className="flex flex-col items-center gap-8 text-center">
          <Eyebrow>404</Eyebrow>
          <Heading as="h1" size="lg">
            Nie znaleziono <em>strony</em>
          </Heading>
          <Text variant="lead">Ta strona nie istnieje albo została przeniesiona.</Text>
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/">Strona główna</Button>
            <Button href="/blog" variant="secondary">
              Blog
            </Button>
          </div>
        </Container>
      </Section>
    </MainLayout>
  );
}
