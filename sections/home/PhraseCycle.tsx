'use client';

import { useEffect, useState } from 'react';

type Phrase = { en: string; pl: string };

const CYCLE_MS = 5000;

/**
 * Hero speech-bubble content. All phrases share one grid cell, so the bubble is sized to the
 * longest and never resizes; only the active one is visible. Cycles every 5 s — `delay` shifts
 * a bubble's beat so neighbours change one after another — except under
 * `prefers-reduced-motion`, where the first phrase stays put.
 */
export function PhraseCycle({
  phrases,
  delay = 0,
}: {
  phrases: readonly Phrase[];
  delay?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (phrases.length < 2) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const next = () => setActive((i) => (i + 1) % phrases.length);
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      next();
      timer = setInterval(next, CYCLE_MS);
    }, CYCLE_MS + delay);
    return () => {
      clearTimeout(start);
      clearInterval(timer);
    };
  }, [phrases.length, delay]);

  return (
    <span className="grid">
      {phrases.map((phrase, i) => (
        <span
          key={phrase.en}
          className={`col-start-1 row-start-1 flex flex-col justify-center gap-1 transition duration-500 ease-out-soft motion-reduce:transition-none ${
            i === active ? 'opacity-100' : 'translate-y-1 opacity-0'
          }`}
        >
          <span className="font-serif text-lg/6 text-foreground italic">{phrase.en}</span>
          <span className="text-xs text-foreground-muted">{phrase.pl}</span>
        </span>
      ))}
    </span>
  );
}
