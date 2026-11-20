import 'server-only';
import { cacheLife } from 'next/cache';
import type { BookingConfirmation, SlotsByDate } from '@/lib/booking';

/** Thin Cal.com API v2 client. The API key never leaves the server. */

const API = 'https://api.cal.com/v2';

export class CalError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function config() {
  const apiKey = process.env.CAL_API_KEY;
  const eventTypeId = Number(process.env.CAL_EVENT_TYPE_ID);
  if (!apiKey || !eventTypeId) throw new CalError('Cal.com is not configured', 503);
  return { apiKey, eventTypeId };
}

async function cal<T>(path: string, version: string, init?: RequestInit): Promise<T> {
  const { apiKey } = config();
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'cal-api-version': version,
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = body?.error?.message ?? body?.message ?? res.statusText;
    throw new CalError(typeof message === 'string' ? message : 'Cal.com error', res.status);
  }
  return body as T;
}

export async function getSlots(start: string, end: string, timeZone: string): Promise<SlotsByDate> {
  const { eventTypeId } = config();
  const query = new URLSearchParams({ eventTypeId: String(eventTypeId), start, end, timeZone });
  const body = await cal<{ data: Record<string, { start: string }[]> }>(
    `/slots?${query}`,
    '2024-09-04',
  );
  return Object.fromEntries(
    Object.entries(body.data ?? {}).map(([date, slots]) => [date, slots.map((s) => s.start)]),
  );
}

export async function createBooking(input: {
  start: string;
  timeZone: string;
  name: string;
  email: string;
  notes: string;
}): Promise<BookingConfirmation> {
  const { eventTypeId } = config();
  const body = await cal<{
    data: { start: string; end: string; location?: string | null; meetingUrl?: string | null };
  }>('/bookings', '2026-02-25', {
    method: 'POST',
    body: JSON.stringify({
      eventTypeId,
      start: new Date(input.start).toISOString(),
      attendee: {
        name: input.name,
        email: input.email,
        timeZone: input.timeZone,
        language: 'pl',
      },
      ...(input.notes ? { bookingFieldsResponses: { notes: input.notes } } : {}),
      metadata: { source: 'angleo.pl' },
    }),
  });
  const { start, end, location, meetingUrl } = body.data;
  return { start, end, location: location ?? meetingUrl ?? null };
}

type BookingWindowSetting =
  | { type: 'calendarDays' | 'businessDays'; value: number; rolling?: boolean }
  | { type: 'range'; value: [string, string] }
  | { disabled: true };

type EventType = {
  title: string;
  lengthInMinutes: number;
  locations?: { type: string }[];
  bookingWindow?: BookingWindowSetting | null;
};

/**
 * The lesson's event type. Cached for minutes, so changes made in Cal.com (length, "Limit future
 * bookings") reach the site within a few minutes.
 */
async function getEventType(): Promise<EventType> {
  'use cache';
  cacheLife('minutes');
  const { eventTypeId } = config();
  const body = await cal<{ data: EventType }>(`/event-types/${eventTypeId}`, '2024-06-14');
  return body.data;
}

export type LessonInfo = { title: string; lengthInMinutes: number; online: boolean };

/** Event type details for the page copy; `null` when Cal.com is unreachable. */
export async function getLessonInfo(): Promise<LessonInfo | null> {
  try {
    const { title, lengthInMinutes, locations = [] } = await getEventType();
    return { title, lengthInMinutes, online: locations.some((l) => l.type === 'integration') };
  } catch {
    return null;
  }
}

/** No limit set in Cal.com, or it can't be read. */
const DEFAULT_HORIZON_DAYS = 60;
/** "Rolling" limits count bookable days, so their end date isn't known up front. */
const ROLLING_HORIZON_DAYS = 90;
const MAX_HORIZON_DAYS = 365;

/**
 * How many days ahead the booking calendar asks Cal.com for slots — driven by the event type's
 * "Limit future bookings" setting (Cal.com → event type → Limits). Cal.com applies that setting
 * to `/slots` itself (business days, rolling windows, date ranges), so this only has to be an
 * upper bound that never cuts the setting short.
 */
export async function getBookingHorizonDays(): Promise<number> {
  let setting: BookingWindowSetting | null | undefined;
  try {
    setting = (await getEventType()).bookingWindow;
  } catch {
    return DEFAULT_HORIZON_DAYS;
  }
  const days = horizonFor(setting);
  return Math.min(Math.max(Math.ceil(days), 1), MAX_HORIZON_DAYS);
}

function horizonFor(setting: BookingWindowSetting | null | undefined): number {
  if (!setting || 'disabled' in setting) return DEFAULT_HORIZON_DAYS;
  if (setting.type === 'range') {
    const end = Date.parse(`${setting.value[1]}T23:59:59Z`);
    // +1: the visitor's "today" can be a day behind or ahead of UTC.
    return Number.isNaN(end) ? DEFAULT_HORIZON_DAYS : (end - Date.now()) / 86_400_000 + 1;
  }
  if (setting.rolling) return ROLLING_HORIZON_DAYS;
  // Business days: N weekdays span at most N × 7/5 calendar days, plus a weekend at the edge.
  return setting.type === 'businessDays' ? (setting.value * 7) / 5 + 2 : setting.value;
}

export type UpcomingLesson = { uid: string; start: string; end: string; location: string | null };

/** Upcoming lessons booked by this attendee email (live from Cal.com, so reschedules show up). */
export async function getUpcomingLessons(email: string, limit = 3): Promise<UpcomingLesson[]> {
  const { eventTypeId } = config();
  const query = new URLSearchParams({
    status: 'upcoming',
    attendeeEmail: email,
    eventTypeId: String(eventTypeId),
    sortStart: 'asc',
    limit: String(limit),
  });
  const body = await cal<{
    data: { uid: string; start: string; end: string; status: string; location?: string | null }[];
  }>(`/bookings?${query}`, '2026-05-01');
  return (body.data ?? [])
    .filter((b) => b.status === 'accepted' || b.status === 'pending')
    .map(({ uid, start, end, location }) => ({ uid, start, end, location: location ?? null }));
}
