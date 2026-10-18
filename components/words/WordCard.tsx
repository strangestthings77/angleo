'use client';

import { useState } from 'react';
import type { Word } from '@/lib/auth';

/**
 * Flip card: the English side shows by default; the translation appears only on hover
 * (pointer devices) or after a tap/click/Enter (touch and keyboard).
 */
export function WordCard({ word }: { word: Word }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      aria-pressed={flipped}
      aria-label={`${word.term} — ${flipped ? 'ukryj' : 'pokaż'} tłumaczenie`}
      onClick={() => setFlipped((v) => !v)}
      className="group block h-full w-full rounded-3xl text-left perspective-distant focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span
        data-flipped={flipped}
        className="grid h-full transition-transform duration-500 ease-out-soft transform-3d group-hover:rotate-y-180 data-[flipped=true]:rotate-y-180 motion-reduce:transition-none"
      >
        {/* Front — English */}
        <span className="col-start-1 row-start-1 flex min-h-48 flex-col gap-3 rounded-3xl border border-border bg-surface p-6 backface-hidden">
          {word.personal && (
            <span className="self-start rounded-full bg-surface-muted px-2.5 py-1 text-xs font-medium tracking-eyebrow text-accent uppercase">
              Dla Ciebie
            </span>
          )}
          <span className="font-serif text-title tracking-display text-foreground">
            {word.term}
          </span>
          {word.example && (
            <span className="text-sm/6 text-foreground-muted italic">{word.example}</span>
          )}
          <span className="mt-auto text-xs text-foreground-muted/80">
            Najedź lub dotknij, aby zobaczyć tłumaczenie
          </span>
        </span>

        {/* Back — Polish */}
        <span className="col-start-1 row-start-1 flex min-h-48 rotate-y-180 flex-col justify-center gap-3 rounded-3xl bg-foreground p-6 text-background backface-hidden">
          <span className="text-xs font-medium tracking-eyebrow text-accent-light uppercase">
            Tłumaczenie
          </span>
          <span className="font-serif text-title tracking-display">{word.translation}</span>
          <span className="text-sm text-inverse-muted">{word.term}</span>
        </span>
      </span>
    </button>
  );
}
