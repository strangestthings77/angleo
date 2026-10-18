import { NextResponse, type NextRequest } from 'next/server';
import { bookingWindow, slotsQuerySchema, type SlotsResponse } from '@/lib/booking';
import { CalError, getSlots } from '@/lib/cal';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  if (!rateLimit(`slots:${clientIp(request)}`, 60, 60_000)) {
    return json({ error: 'Zbyt wiele zapytań. Spróbuj za chwilę.' }, 429);
  }

  const parsed = slotsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return json({ error: 'Nieprawidłowe zapytanie.' }, 400);

  const { timeZone } = parsed.data;
  if (parsed.data.start > parsed.data.end) return json({ error: 'Nieprawidłowy zakres dat.' }, 400);

  // Clamp to the two-week booking window, whatever the client asked for.
  const bounds = bookingWindow(timeZone);
  const start = parsed.data.start > bounds.first ? parsed.data.start : bounds.first;
  const end = parsed.data.end < bounds.last ? parsed.data.end : bounds.last;
  if (start > end) return json({ slots: {} });

  try {
    const slots = await getSlots(start, end, timeZone);
    // Cal groups by local date; drop anything that spills past the window edge.
    return json({
      slots: Object.fromEntries(Object.entries(slots).filter(([date]) => date <= bounds.last)),
    });
  } catch (error) {
    console.error('[booking/slots]', error);
    const status = error instanceof CalError && error.status === 503 ? 503 : 502;
    return json({ error: 'Nie udało się pobrać wolnych terminów.' }, status);
  }
}

function json(body: SlotsResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
