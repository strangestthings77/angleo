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

export type LessonInfo = { title: string; lengthInMinutes: number; online: boolean };

/** Event type details for the page copy. Cached; `null` when Cal.com is unreachable. */
export async function getLessonInfo(): Promise<LessonInfo | null> {
  'use cache';
  cacheLife('hours');
  try {
    const { eventTypeId } = config();
    const body = await cal<{
      data: { title: string; lengthInMinutes: number; locations?: { type: string }[] };
    }>(`/event-types/${eventTypeId}`, '2024-06-14');
    const { title, lengthInMinutes, locations = [] } = body.data;
    return { title, lengthInMinutes, online: locations.some((l) => l.type === 'integration') };
  } catch {
    return null;
  }
}
