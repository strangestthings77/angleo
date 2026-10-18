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
        <Container className="flex flex-col items-center gap-6 text-center">
          <Heading level={1}>Nie znaleziono strony</Heading>
          <Text>Ta strona nie istnieje albo została przeniesiona.</Text>
          <Button href="/">Strona główna</Button>
        </Container>
      </Section>
    </MainLayout>
  );
}
