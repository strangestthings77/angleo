/** Calendar math on plain `YYYY-MM-DD` keys — no time-zone drift (all arithmetic in UTC). */

export type Month = { year: number; month: number }; // month: 0–11

export const toKey = (y: number, m: number, d: number) =>
  `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

/** Today's date key in `timeZone`. */
export function todayKey(timeZone: string): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone }).format(new Date());
}

export function monthOf(key: string): Month {
  const [y, m] = key.split('-').map(Number);
  return { year: y, month: m - 1 };
}

export function addMonths({ year, month }: Month, n: number): Month {
  const d = new Date(Date.UTC(year, month + n, 1));
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}

export const compareMonths = (a: Month, b: Month) =>
  a.year * 12 + a.month - (b.year * 12 + b.month);

export function daysInMonth({ year, month }: Month): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** Leading blanks so the grid starts on Monday. */
export function leadingBlanks({ year, month }: Month): number {
  return (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function formatMonth({ year, month }: Month): string {
  return capitalize(
    new Date(Date.UTC(year, month, 1)).toLocaleDateString('pl-PL', {
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    }),
  );
}

export function formatDay(key: string, withYear = false): string {
  const [y, m, d] = key.split('-').map(Number);
  return capitalize(
    new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('pl-PL', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      ...(withYear ? { year: 'numeric' } : {}),
      timeZone: 'UTC',
    }),
  );
}

export function formatTime(iso: string, timeZone: string): string {
  return new Date(iso).toLocaleTimeString('pl-PL', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone,
  });
}

export const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];
