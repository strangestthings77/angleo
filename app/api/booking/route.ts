import { NextResponse } from 'next/server';
import { bookingRequestSchema, type BookingResponse } from '@/lib/booking';
import { CalError, createBooking } from '@/lib/cal';
import { clientIp, rateLimit } from '@/lib/rate-limit';

/** Faster than this from form render to submit is treated as a bot. */
const MIN_FILL_MS = 3_000;

export async function POST(request: Request) {
  if (!rateLimit(`book:${clientIp(request)}`, 5, 10 * 60_000)) {
    return json({ error: 'Zbyt wiele prób rezerwacji. Spróbuj ponownie później.' }, 429);
  }

  const parsed = bookingRequestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message ?? 'Sprawdź dane w formularzu.';
    return json({ error: message, code: 'invalid' }, 400);
  }

  const { website, renderedAt, ...input } = parsed.data;
  if (website || Date.now() - renderedAt < MIN_FILL_MS) {
    // Deliberately generic so bots learn nothing; real users never hit this.
    return json({ error: 'Nie udało się zarezerwować terminu.', code: 'rejected' }, 400);
  }
  if (Date.parse(input.start) < Date.now()) {
    return json({ error: 'Ten termin już minął — wybierz inny.', code: 'unavailable' }, 409);
  }

  try {
    const booking = await createBooking(input);
    return json({ booking }, 201);
  } catch (error) {
    console.error('[booking]', error);
    if (error instanceof CalError && error.status >= 400 && error.status < 500) {
      return json(
        { error: 'Ten termin jest już niedostępny — wybierz inny.', code: 'unavailable' },
        409,
      );
    }
    return json({ error: 'Nie udało się zarezerwować terminu. Spróbuj ponownie.' }, 502);
  }
}

function json(body: BookingResponse, status: number) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}
