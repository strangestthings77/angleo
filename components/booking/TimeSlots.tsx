'use client';

import { formatDay, formatTime } from '@/components/booking/dates';

export function TimeSlots({
  date,
  slots,
  timeZone,
  onSelect,
}: {
  date: string | null;
  slots: string[];
  timeZone: string;
  onSelect: (iso: string) => void;
}) {
  if (!date) {
    return (
      <p className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
        Wybierz dzień z zaznaczonymi wolnymi terminami.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs font-medium tracking-eyebrow text-accent uppercase">Wolne godziny</p>
        <h3 className="mt-2 font-serif text-title tracking-display text-foreground">
          {formatDay(date)}
        </h3>
      </div>
      <ul className="grid max-h-96 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-3 lg:grid-cols-2">
        {slots.map((iso) => (
          <li key={iso}>
            <button
              type="button"
              onClick={() => onSelect(iso)}
              className="flex h-12 w-full items-center justify-center rounded-full border border-border text-base font-medium text-foreground tabular-nums transition-colors duration-200 hover:border-foreground hover:bg-foreground hover:text-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {formatTime(iso, timeZone)}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
