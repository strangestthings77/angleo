'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { BookingForm } from '@/components/booking/BookingForm';
import { BookingSuccess } from '@/components/booking/BookingSuccess';
import { addMonths, compareMonths, formatDayMonth, monthOf } from '@/components/booking/dates';
import { MonthCalendar } from '@/components/booking/MonthCalendar';
import { TimeSlots } from '@/components/booking/TimeSlots';
import {
  BOOKING_WINDOW_DAYS,
  bookingWindow,
  type BookingConfirmation,
  type BookingViewer,
  type SlotsByDate,
  type SlotsResponse,
} from '@/lib/booking';

type Step =
  | { name: 'pick' }
  | { name: 'form'; date: string; start: string }
  | { name: 'done'; booking: BookingConfirmation };

const noop = () => () => {};
/** The visitor's time zone — only known in the browser (`null` during SSR). */
const useTimeZone = () =>
  useSyncExternalStore(
    noop,
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || 'Europe/Warsaw',
    () => null,
  );

type SlotsResult = { key: string; slots: SlotsByDate; error: string | null };

/** Custom booking flow on top of Cal.com: day → time → details → confirmation, two weeks ahead. */
export function BookingWidget({ viewer = null }: { viewer?: BookingViewer | null }) {
  const timeZone = useTimeZone();
  const range = timeZone ? bookingWindow(timeZone) : null;
  const today = range?.first ?? '';
  const minMonth = range ? monthOf(range.first) : null;
  const maxMonth = range ? monthOf(range.last) : null;
  const [monthOffset, setMonthOffset] = useState(0);
  const month = minMonth ? addMonths(minMonth, monthOffset) : null;

  const [result, setResult] = useState<SlotsResult | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [step, setStep] = useState<Step>({ name: 'pick' });
  const [notice, setNotice] = useState<string | null>(null);
  const [reload, setReload] = useState(0);

  // The whole window is at most two weeks, so it's fetched once, not per month.
  const first = range?.first ?? '';
  const last = range?.last ?? '';
  const requestKey = timeZone && first ? `${first}|${last}|${timeZone}|${reload}` : '';

  useEffect(() => {
    if (!requestKey || !timeZone) return;
    const controller = new AbortController();
    const query = new URLSearchParams({ start: first, end: last, timeZone });
    fetch(`/api/booking/slots?${query}`, { signal: controller.signal })
      .then((res) => res.json() as Promise<SlotsResponse>)
      .then((body) => {
        if ('error' in body) throw new Error(body.error);
        setResult({ key: requestKey, slots: body.slots, error: null });
      })
      .catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setResult({
          key: requestKey,
          slots: {},
          error: err.message || 'Nie udało się pobrać terminów.',
        });
      });
    return () => controller.abort();
  }, [requestKey, first, last, timeZone]);

  const loading = !result || result.key !== requestKey;
  const slots = loading ? {} : result.slots;
  const error = notice ?? (loading ? null : result.error);
  const available = new Set(Object.keys(slots).filter((key) => slots[key].length > 0));
  const monthPrefix = month ? `${month.year}-${String(month.month + 1).padStart(2, '0')}` : '';
  const availableThisMonth = [...available].filter((key) => key.startsWith(monthPrefix)).sort();

  // Fall back to the first available day in view so the times column is never empty.
  const selected = picked && available.has(picked) ? picked : (availableThisMonth[0] ?? null);

  const changeMonth = (delta: 1 | -1) => {
    setPicked(null);
    setNotice(null);
    setMonthOffset((n) => n + delta);
  };

  const refresh = () => {
    setNotice(null);
    setReload((n) => n + 1);
  };

  if (!timeZone || !month || !minMonth || !maxMonth) return <WidgetSkeleton />;

  if (step.name === 'done') {
    return (
      <div className="animate-fade">
        <BookingSuccess
          signedIn={Boolean(viewer)}
          booking={step.booking}
          timeZone={timeZone}
          onReset={() => {
            setStep({ name: 'pick' });
            refresh();
          }}
        />
      </div>
    );
  }

  if (step.name === 'form') {
    return (
      <div className="animate-fade">
        <BookingForm
          viewer={viewer}
          start={step.start}
          date={step.date}
          timeZone={timeZone}
          onBack={() => setStep({ name: 'pick' })}
          onBooked={(booking) => setStep({ name: 'done', booking })}
          onUnavailable={(message) => {
            setStep({ name: 'pick' });
            setReload((n) => n + 1);
            setNotice(message);
          }}
        />
      </div>
    );
  }

  const noSlots = !loading && !error && availableThisMonth.length === 0;
  const laterMonth = compareMonths(month, maxMonth) < 0 && available.size > 0;

  return (
    <div className="flex animate-fade flex-col gap-6">
      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-sm text-foreground sm:flex-row sm:items-center sm:justify-between"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={refresh}
            className="min-h-11 self-start font-medium underline underline-offset-4 sm:self-center"
          >
            Odśwież terminy
          </button>
        </div>
      )}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
        <MonthCalendar
          month={month}
          minMonth={minMonth}
          maxMonth={maxMonth}
          today={today}
          available={available}
          selected={selected}
          loading={loading}
          onMonthChange={changeMonth}
          onSelect={(key) => {
            setPicked(key);
            setNotice(null);
          }}
        />
        <div className="lg:border-l lg:border-border lg:pl-12">
          {noSlots ? (
            <p className="flex h-full min-h-40 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-center text-sm text-foreground-muted">
              {laterMonth
                ? 'W tym miesiącu brak wolnych terminów — sprawdź następny.'
                : `Brak wolnych terminów w najbliższych ${BOOKING_WINDOW_DAYS} dniach. Napisz lub zadzwoń — znajdziemy termin.`}
            </p>
          ) : (
            <TimeSlots
              key={selected ?? 'none'}
              date={loading ? null : selected}
              slots={selected ? (slots[selected] ?? []) : []}
              timeZone={timeZone}
              onSelect={(start) => selected && setStep({ name: 'form', date: selected, start })}
            />
          )}
        </div>
      </div>
      <p className="text-xs/5 text-foreground-muted">
        Terminy na 2 tygodnie do przodu — do {formatDayMonth(last)}. Godziny w strefie czasowej:{' '}
        <span className="font-medium">{timeZone.replace('_', ' ')}</span>
      </p>
    </div>
  );
}

export function WidgetSkeleton() {
  return (
    <div aria-hidden className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-12">
      <div className="flex flex-col gap-6">
        <div className="h-11 w-48 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none" />
        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className="mx-auto aspect-square w-full max-w-12 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none"
            />
          ))}
        </div>
      </div>
      <div className="min-h-40 animate-pulse rounded-2xl bg-surface-muted motion-reduce:animate-none" />
    </div>
  );
}
