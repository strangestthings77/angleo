import Link from 'next/link';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { BookIcon } from '@/components/ui/Icon';
import { Container } from '@/components/ui/Container';

export function StudentAreaComingSoon() {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex justify-center">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-surface-muted text-accent">
            <BookIcon size={28} />
          </div>
          <div className="flex animate-rise flex-col items-center gap-4">
            <Eyebrow className="justify-center">STREFA UCZNIA</Eyebrow>
            <Heading as="h1" size="lg">
              <Accent text="Coś dobrego się *szykuje.*" />
            </Heading>
            <h2 className="font-serif text-title tracking-display text-foreground">
              Strefa ucznia w przygotowaniu
            </h2>
            <Text>
              Pracuję nad nową przestrzenią dla moich uczniów. Na razie nie jest jeszcze dostępna.
            </Text>
          </div>
          <Link
            href="/umow-lekcje"
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[background-color,scale] duration-200 ease-out hover:bg-foreground/85 active:scale-97"
          >
            Umów lekcję →
          </Link>
          <Link
            href="/"
            className="text-sm text-foreground-muted underline-offset-4 hover:text-foreground hover:underline"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </Container>
    </section>
  );
}
