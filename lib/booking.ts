import { z } from 'zod';

/** Shared between the booking route handlers and the client widget. */

/** Bookable range: today plus the next 13 days (two weeks). Enforced in the UI and both routes. */
export const BOOKING_WINDOW_DAYS = 14;

/** `YYYY-MM-DD` of `date` in `timeZone`. */
export function dateKeyIn(timeZone: string, date: Date = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(date);
}

export function addDays(key: string, days: number): string {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

/** First and last bookable date keys for a visitor in `timeZone`. */
export function bookingWindow(timeZone: string): { first: string; last: string } {
  const first = dateKeyIn(timeZone);
  return { first, last: addDays(first, BOOKING_WINDOW_DAYS - 1) };
}

const isTimeZone = (tz: string) => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: tz });
    return true;
  } catch {
    return false;
  }
};

const dateOnly = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const timeZone = z.string().min(1).max(64).refine(isTimeZone, 'Nieprawidłowa strefa czasowa');

export const slotsQuerySchema = z.object({ start: dateOnly, end: dateOnly, timeZone });

export const bookingRequestSchema = z.object({
  start: z.iso.datetime({ offset: true }),
  timeZone,
  name: z.string().trim().min(2, 'Podaj imię i nazwisko').max(100),
  email: z.email('Podaj poprawny adres e-mail').max(200),
  notes: z.string().trim().max(1000).optional().default(''),
  /** Honeypot — real users never see or fill it. */
  website: z.string().max(500).optional().default(''),
  /** `Date.now()` when the form was shown — submissions faster than a human are rejected. */
  renderedAt: z.number().int().positive(),
});

export type BookingRequest = z.input<typeof bookingRequestSchema>;

/** Slots keyed by local date (`YYYY-MM-DD` in the requested time zone) → ISO start times. */
export type SlotsByDate = Record<string, string[]>;

export type SlotsResponse = { slots: SlotsByDate } | { error: string };

export type BookingConfirmation = { start: string; end: string; location: string | null };

export type BookingResponse = { booking: BookingConfirmation } | { error: string; code?: string };
