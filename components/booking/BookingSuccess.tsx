'use client';

import { formatDay, formatTime } from '@/components/booking/dates';
import type { BookingConfirmation } from '@/lib/booking';

export function BookingSuccess({
  booking,
  timeZone,
  onReset,
}: {
  booking: BookingConfirmation;
  timeZone: string;
  onReset: () => void;
}) {
  const dateKey = new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date(booking.start));
  const isLink = booking.location?.startsWith('http');

  return (
    <div role="status" className="flex flex-col items-center gap-6 py-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-foreground text-background">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden
        >
          <path d="m5 12 5 5L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-display-sm tracking-display text-foreground">
          Do zobaczenia na <em className="text-accent">lekcji!</em>
        </h3>
        <p className="text-lead text-foreground-muted">
          {formatDay(dateKey, true)}, godz. {formatTime(booking.start, timeZone)}–
          {formatTime(booking.end, timeZone)}
        </p>
      </div>
      <p className="max-w-md text-sm/6 text-foreground-muted">
        Potwierdzenie rezerwacji wysłaliśmy na Twój e-mail. Znajdziesz w nim też opcję zmiany
        terminu lub odwołania lekcji.
      </p>
      {isLink && (
        <a
          href={booking.location!}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-medium text-foreground underline decoration-accent underline-offset-4 hover:text-accent"
        >
          Link do spotkania
        </a>
      )}
      <button
        type="button"
        onClick={onReset}
        className="min-h-11 text-sm text-foreground-muted underline underline-offset-4 hover:text-foreground"
      >
        Zarezerwuj kolejny termin
      </button>
    </div>
  );
}
