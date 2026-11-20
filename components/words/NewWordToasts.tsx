'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { BookIcon, CloseIcon } from '@/components/ui/Icon';
import { createClient } from '@/lib/supabase/client';

type WordRow = { id: number; term: string; translation: string };
type Toast = WordRow & { leaving: boolean };

/** How long a toast stays up. */
const SHOW_MS = 10_000;
/** Matches the exit transition (duration-150) before the toast is removed. */
const EXIT_MS = 150;
const MAX_TOASTS = 3;

/**
 * Live "new word" toasts on /panel: when Nicole adds a word for this student (e.g. during a lesson),
 * Supabase Realtime delivers the insert and the panel refreshes so the Słówka tab shows it too.
 */
export function NewWordToasts({ studentId }: { studentId: string }) {
  const router = useRouter();
  const [supabase] = useState(() => createClient());
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((all) => all.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => setToasts((all) => all.filter((t) => t.id !== id)), EXIT_MS);
  }, []);

  useEffect(() => {
    let cancelled = false;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    async function connect() {
      // Join with the student's token — joined anonymously, RLS filters out every event.
      await supabase.auth.getSession();
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase
        .channel(`words-${studentId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'words',
            filter: `student_id=eq.${studentId}`,
          },
          (payload) => {
            const { id, term, translation } = payload.new as WordRow;
            setToasts((all) =>
              [...all, { id, term, translation, leaving: false }].slice(-MAX_TOASTS),
            );
            setTimeout(() => dismiss(id), SHOW_MS);
            router.refresh();
          },
        )
        .subscribe();
    }

    void connect();
    return () => {
      cancelled = true;
      if (channel) void supabase.removeChannel(channel);
    };
  }, [supabase, studentId, router, dismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-22 z-30 flex flex-col items-end gap-3 sm:right-6 sm:left-auto sm:w-80"
    >
      {toasts.map((toast) => (
        // Exit transition on the wrapper: animate-pop's fill holds opacity/translate on the card.
        <div
          key={toast.id}
          className={`pointer-events-auto w-full transition-[opacity,translate] duration-150 ease-out motion-reduce:transition-none ${toast.leaving ? '-translate-y-1 opacity-0' : ''}`}
        >
          <div className="flex animate-pop items-start gap-3 rounded-2xl border border-border bg-surface py-3 pr-2 pl-3 shadow-card">
            <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
              <BookIcon size={14} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 py-0.5">
              <p className="text-xs text-foreground-muted">Nowe słówko</p>
              <p className="text-sm/5 font-medium break-words text-foreground">{toast.term}</p>
              <p className="text-sm/5 text-accent">{toast.translation}</p>
            </div>
            <button
              type="button"
              aria-label="Zamknij powiadomienie"
              onClick={() => dismiss(toast.id)}
              className="-my-1 flex size-10 shrink-0 items-center justify-center rounded-full text-foreground-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-2 focus-visible:outline-accent"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
