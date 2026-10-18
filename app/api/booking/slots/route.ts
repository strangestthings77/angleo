import { NextResponse, type NextRequest } from 'next/server';
import { slotsQuerySchema, type SlotsResponse } from '@/lib/booking';
import { CalError, getSlots } from '@/lib/cal';
import { clientIp, rateLimit } from '@/lib/rate-limit';

const MAX_RANGE_DAYS = 45;

export async function GET(request: NextRequest) {
  if (!rateLimit(`slots:${clientIp(request)}`, 60, 60_000)) {
    return json({ error: 'Zbyt wiele zapytań. Spróbuj za chwilę.' }, 429);
  }

  const parsed = slotsQuerySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams));
  if (!parsed.success) return json({ error: 'Nieprawidłowe zapytanie.' }, 400);

  const { start, end, timeZone } = parsed.data;
  const days = (Date.parse(end) - Date.parse(start)) / 86_400_000;
  if (days < 0 || days > MAX_RANGE_DAYS) return json({ error: 'Nieprawidłowy zakres dat.' }, 400);

  try {
    return json({ slots: await getSlots(start, end, timeZone) });
  } catch (error) {
    console.error('[booking/slots]', error);
    const status = error instanceof CalError && error.status === 503 ? 503 : 502;
    return json({ error: 'Nie udało się pobrać wolnych terminów.' }, status);
  }
}

function json(body: SlotsResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
