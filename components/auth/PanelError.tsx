'use client';

import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';

/** Error state for /panel and /admin — e.g. the profile couldn't be loaded. */
export function PanelError({ reset }: { reset: () => void }) {
  return (
    <Container className="flex flex-col items-start gap-6 py-section">
      <Eyebrow>Strefa ucznia</Eyebrow>
      <Heading as="h1" size="md">
        Coś poszło <em>nie tak</em>
      </Heading>
      <p className="max-w-lg text-foreground-muted">
        Nie udało się wczytać Twojego konta. Spróbuj ponownie za chwilę — jeśli problem się
        powtarza, wyloguj się i zaloguj ponownie.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex h-12 items-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[background-color,scale] duration-200 ease-out hover:bg-foreground/85 active:scale-97"
        >
          Spróbuj ponownie
        </button>
        <a
          href="/logowanie"
          className="inline-flex h-12 items-center rounded-full border border-foreground/20 px-6 text-sm font-medium text-foreground hover:border-foreground/60"
        >
          Zaloguj się ponownie
        </a>
      </div>
    </Container>
  );
}
