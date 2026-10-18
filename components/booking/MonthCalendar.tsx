'use client';

import { ArrowRightIcon } from '@/components/ui/Icon';
import {
  WEEKDAYS,
  compareMonths,
  daysInMonth,
  formatDay,
  formatMonth,
  leadingBlanks,
  toKey,
  type Month,
} from '@/components/booking/dates';

export function MonthCalendar({
  month,
  minMonth,
  maxMonth,
  today,
  available,
  selected,
  loading,
  onMonthChange,
  onSelect,
}: {
  month: Month;
  minMonth: Month;
  maxMonth: Month;
  today: string;
  available: Set<string>;
  selected: string | null;
  loading: boolean;
  onMonthChange: (delta: 1 | -1) => void;
  onSelect: (key: string) => void;
}) {
  const days = daysInMonth(month);
  const blanks = leadingBlanks(month);
  const canPrev = compareMonths(month, minMonth) > 0;
  const canNext = compareMonths(month, maxMonth) < 0;
  const nav =
    'inline-flex size-11 items-center justify-center rounded-full border border-border text-foreground transition-colors duration-200 hover:border-foreground/40 disabled:pointer-events-none disabled:opacity-30';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-title tracking-display text-foreground" aria-live="polite">
          {formatMonth(month)}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            className={nav}
            onClick={() => onMonthChange(-1)}
            disabled={!canPrev}
            aria-label="Poprzedni miesiąc"
          >
            <ArrowRightIcon className="rotate-180" />
          </button>
          <button
            type="button"
            className={nav}
            onClick={() => onMonthChange(1)}
            disabled={!canNext}
            aria-label="Następny miesiąc"
          >
            <ArrowRightIcon />
          </button>
        </div>
      </div>

      <div aria-busy={loading} className="grid grid-cols-7 gap-1 sm:gap-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            aria-hidden
            className="pb-2 text-center text-xs font-medium tracking-eyebrow text-foreground-muted uppercase"
          >
            {day}
          </div>
        ))}
        {Array.from({ length: blanks }, (_, i) => (
          <div key={`blank-${i}`} aria-hidden />
        ))}
        {Array.from({ length: days }, (_, i) => {
          const key = toKey(month.year, month.month, i + 1);
          const isAvailable = !loading && available.has(key);
          const isSelected = key === selected;
          const isToday = key === today;
          return (
            <button
              key={key}
              type="button"
              disabled={!isAvailable}
              aria-pressed={isSelected}
              aria-label={`${formatDay(key, true)}${isAvailable ? ', wolne terminy' : ', brak terminów'}`}
              onClick={() => onSelect(key)}
              className={`relative mx-auto flex aspect-square w-full max-w-12 items-center justify-center rounded-full text-sm tabular-nums transition-colors duration-200 ${
                isSelected
                  ? 'bg-foreground font-medium text-background'
                  : isAvailable
                    ? 'bg-surface-muted font-medium text-foreground hover:bg-foreground/10'
                    : 'text-foreground-muted/50'
              } ${loading ? 'animate-pulse motion-reduce:animate-none' : ''}`}
            >
              {i + 1}
              {isToday && (
                <span
                  aria-hidden
                  className={`absolute bottom-1.5 size-1 rounded-full ${isSelected ? 'bg-background' : 'bg-accent'}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
