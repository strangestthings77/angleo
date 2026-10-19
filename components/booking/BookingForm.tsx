'use client';

import { useState } from 'react';
import { formatDay, formatTime } from '@/components/booking/dates';
import { ArrowRightIcon, CalendarIcon } from '@/components/ui/Icon';
import type {
  BookingConfirmation,
  BookingRequest,
  BookingResponse,
  BookingViewer,
} from '@/lib/booking';

const field =
  'h-12 w-full rounded-xl border border-border bg-background px-4 text-base text-foreground placeholder:text-foreground-muted/60 transition-colors duration-200 focus:border-foreground focus:outline-none';
const label = 'text-sm font-medium text-foreground';

function buildBookingNotes(form: FormData) {
  const lines = [
    ['Jak Ci idzie mówienie po angielsku?', String(form.get('speakingConfidence') ?? '')],
    ['W jakiej branży pracujesz?', String(form.get('industry') ?? '')],
    ['Doprecyzowanie branży', String(form.get('industryOther') ?? '')],
    ['Dodatkowe informacje', String(form.get('additionalNotes') ?? '')],
  ].filter(([, value]) => value.trim());

  return lines.map(([question, answer]) => `${question}: ${answer}`).join('\n');
}

export function BookingForm({
  start,
  date,
  timeZone,
  onBack,
  onBooked,
  onUnavailable,
  viewer,
}: {
  viewer: BookingViewer | null;
  start: string;
  date: string;
  timeZone: string;
  onBack: () => void;
  onBooked: (booking: BookingConfirmation) => void;
  onUnavailable: (message: string) => void;
}) {
  const [renderedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<'idle' | 'sending'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [industry, setIndustry] = useState('');
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload: BookingRequest = {
      start,
      timeZone,
      // Signed in: the server uses the account's name and email.
      ...(viewer
        ? {}
        : { name: String(form.get('name') ?? ''), email: String(form.get('email') ?? '') }),
      notes: buildBookingNotes(form),
      website: String(form.get('website') ?? ''),
      renderedAt,
    };

    setStatus('sending');
    setError(null);
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const body = (await res.json()) as BookingResponse;
      if ('booking' in body) return onBooked(body.booking);
      if (body.code === 'unavailable') return onUnavailable(body.error);
      setError(body.error);
    } catch {
      setError('Brak połączenia. Sprawdź internet i spróbuj ponownie.');
    }
    setStatus('idle');
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 rounded-2xl bg-surface-muted p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-background text-accent">
            <CalendarIcon size={18} />
          </span>
          <div>
            <p className="font-medium text-foreground">{formatDay(date, true)}</p>
            <p className="text-sm text-foreground-muted">
              godz. {formatTime(start, timeZone)} · {timeZone.replace('_', ' ')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="min-h-11 self-start text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent sm:self-center"
        >
          Zmień termin
        </button>
      </div>

      {viewer && (
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-foreground-muted">
          Rezerwujesz jako
          <span className="font-medium text-foreground">{viewer.name ?? viewer.email}</span>
          {viewer.name && <span>({viewer.email})</span>}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        {!viewer && (
          <>
            <label className="flex flex-col gap-2">
              <span className={label}>Imię i nazwisko</span>
              <input
                name="name"
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                className={field}
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className={label}>E-mail</span>
              <input
                name="email"
                type="email"
                required
                maxLength={200}
                autoComplete="email"
                inputMode="email"
                className={field}
              />
            </label>
          </>
        )}
        <fieldset className="flex flex-col gap-5 rounded-2xl bg-surface-muted p-5 sm:col-span-2">
          <div className="flex flex-col gap-1">
            <legend className="font-serif text-title tracking-display text-foreground">
              Poznajmy się trochę lepiej
            </legend>
            <p className="text-sm/6 text-foreground-muted">
              Te informacje pomogą mi przygotować pierwszą lekcję specjalnie dla Ciebie. Wszystkie
              pytania są opcjonalne.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-2">
              <span className={label}>Jak Ci idzie mówienie po angielsku?</span>
              <select name="speakingConfidence" defaultValue="" className={field}>
                <option value="">Wybierz odpowiedź</option>
                <option>Dopiero zaczynam</option>
                <option>Rozumiem sporo, ale trudno mi mówić</option>
                <option>Dogaduję się, ale brakuje mi swobody</option>
                <option>Mówię swobodnie, ale chcę mówić jeszcze lepiej</option>
                <option>Trudno mi to ocenić</option>
              </select>
            </label>

            <label className="flex flex-col gap-2 sm:col-span-2">
              <span className={label}>W jakiej branży pracujesz?</span>
              <select
                name="industry"
                value={industry}
                onChange={(event) => setIndustry(event.target.value)}
                className={field}
              >
                <option value="">Wybierz odpowiedź</option>
                <option>IT i technologie</option>
                <option>Finanse, bankowość i księgowość</option>
                <option>Sprzedaż i marketing</option>
                <option>Logistyka i produkcja</option>
                <option>Zarządzanie i HR</option>
                <option>Inna branża</option>
                <option>Nie dotyczy</option>
              </select>
            </label>

            {industry === 'Inna branża' && (
              <label className="flex flex-col gap-2 sm:col-span-2">
                <span className={label}>Doprecyzuj branżę (opcjonalnie)</span>
                <input name="industryOther" maxLength={120} className={field} />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => setShowAdditionalNotes((shown) => !shown)}
              className="self-start text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent"
              aria-expanded={showAdditionalNotes}
            >
              Chcesz dodać coś od siebie?
            </button>
            {showAdditionalNotes && (
              <textarea
                name="additionalNotes"
                rows={3}
                maxLength={500}
                placeholder="Np. Za miesiąc prowadzę prezentację dla zagranicznego klienta."
                className={`${field} h-auto resize-y py-3`}
              />
            )}
          </div>
        </fieldset>
        {/* Honeypot: hidden from people and assistive tech, tempting to bots. */}
        <div aria-hidden className="sr-only">
          <label>
            Website
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground"
        >
          {error}
        </p>
      )}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm/6 text-foreground-muted">
          Potwierdzenie i link do spotkania otrzymasz e-mailem.
        </p>
        <button
          type="submit"
          disabled={status === 'sending'}
          className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[background-color,opacity] duration-200 hover:bg-foreground/85 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent disabled:opacity-60"
        >
          {status === 'sending' ? 'Rezerwuję…' : 'Zarezerwuj lekcję'}
          {status === 'idle' && (
            <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
          )}
        </button>
      </div>
    </form>
  );
}
