'use client';

import { useEffect, useState } from 'react';
import { ExerciseText, gapClass, gapWidth } from '@/components/exercises/ExerciseText';
import { isGapCorrect, type Answers, type GapHint } from '@/lib/exercise';
import { createClient } from '@/lib/supabase/client';

type LiveAttempt = {
  answers: Answers;
  submittedAt: string | null;
  score: number | null;
  total: number | null;
  updatedAt: string;
} | null;

type AttemptRow = {
  answers: Answers;
  submitted_at: string | null;
  score: number | null;
  total: number | null;
  updated_at: string;
};

const fromRow = (r: AttemptRow): LiveAttempt => ({
  answers: r.answers ?? {},
  submittedAt: r.submitted_at,
  score: r.score,
  total: r.total,
  updatedAt: r.updated_at,
});

/** Typing within this window shows as "pisze teraz…". */
const TYPING_MS = 4000;
/** Fallback refresh while Realtime is disconnected. */
const POLL_MS = 2000;

function ago(iso: string, now: number): string {
  const s = Math.max(0, Math.round((now - Date.parse(iso)) / 1000));
  if (s < 60) return `${s} s temu`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min temu`;
  return new Date(iso).toLocaleString('pl-PL', { dateStyle: 'short', timeStyle: 'short' });
}

/** Admin watches a student's attempt live via Supabase Realtime (RLS: admins read all attempts). */
export function LiveExerciseView({
  exerciseId,
  hints,
  template,
  answers,
  initialAttempt,
}: {
  exerciseId: string;
  hints: GapHint[];
  template: string;
  answers: string[][];
  initialAttempt: LiveAttempt;
}) {
  const [supabase] = useState(() => createClient());
  const [attempt, setAttempt] = useState<LiveAttempt>(initialAttempt);
  const [connected, setConnected] = useState(false);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let cancelled = false;
    let poll: ReturnType<typeof setInterval> | undefined;
    let channel: ReturnType<typeof supabase.channel> | undefined;

    async function refresh() {
      const { data } = await supabase
        .from('exercise_attempts')
        .select('answers, submitted_at, score, total, updated_at')
        .eq('exercise_id', exerciseId)
        .maybeSingle<AttemptRow>();
      if (!cancelled) setAttempt(data ? fromRow(data) : null);
    }

    async function connect() {
      // Load the session first, so the channel joins as the admin — joined anonymously it
      // still reports SUBSCRIBED, but RLS filters out every event.
      await supabase.auth.getSession();
      await supabase.realtime.setAuth();
      if (cancelled) return;
      channel = supabase
        .channel(`attempt-${exerciseId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'exercise_attempts',
            filter: `exercise_id=eq.${exerciseId}`,
          },
          (payload) => {
            if (payload.eventType === 'DELETE') setAttempt(null);
            else setAttempt(fromRow(payload.new as AttemptRow));
          },
        )
        .subscribe((status) => {
          const live = status === 'SUBSCRIBED';
          setConnected(live);
          clearInterval(poll);
          // Catch up on anything typed before the channel opened; poll while it's down.
          void refresh();
          if (!live) poll = setInterval(() => void refresh(), POLL_MS);
        });
    }

    void connect();
    return () => {
      cancelled = true;
      clearInterval(poll);
      if (channel) void supabase.removeChannel(channel);
    };
  }, [supabase, exerciseId]);

  // Tick so "pisze teraz…" / "x s temu" stay current.
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const typed = attempt?.answers ?? {};
  const correct = hints.filter((_, i) => isGapCorrect(typed[i] ?? '', answers[i] ?? [])).length;
  const filled = hints.filter((_, i) => (typed[i] ?? '').trim()).length;
  const typing = attempt && !attempt.submittedAt && now - Date.parse(attempt.updatedAt) < TYPING_MS;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
        <span className="inline-flex items-center gap-2 text-foreground-muted">
          <span
            aria-hidden
            className={`size-2 rounded-full ${connected ? 'bg-success' : 'bg-foreground-muted/40'}`}
          />
          {connected ? 'Na żywo' : 'Łączenie…'}
        </span>
        {attempt?.submittedAt ? (
          <span className="font-medium text-foreground tabular-nums">
            Oddane · wynik {attempt.score} / {attempt.total}
          </span>
        ) : typing ? (
          <span className="inline-flex items-center gap-2 font-medium text-accent">
            <span aria-hidden className="size-2 animate-pulse rounded-full bg-accent" />
            pisze teraz…
          </span>
        ) : attempt ? (
          <span className="text-foreground-muted">
            ostatnia zmiana {ago(attempt.updatedAt, now)}
          </span>
        ) : (
          <span className="text-foreground-muted">Uczeń jeszcze nie otworzył ćwiczenia</span>
        )}
        <span className="text-foreground-muted tabular-nums">
          Uzupełnione {filled} / {hints.length} · poprawne {correct}
        </span>
      </div>

      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <ExerciseText
          template={template}
          renderGap={(i) => {
            const value = typed[i] ?? '';
            const state = !value.trim()
              ? 'idle'
              : isGapCorrect(value, answers[i] ?? [])
                ? 'correct'
                : 'wrong';
            return (
              <span
                className="relative inline-flex flex-col items-center align-baseline"
                title={`Poprawnie: ${(answers[i] ?? []).join(' / ')}`}
              >
                <span
                  style={{ '--gap-w': gapWidth(hints[i]) } as React.CSSProperties}
                  className={`${gapClass(state)} min-h-6`}
                >
                  {value || <span className="text-foreground-muted/50">{hints[i]?.pattern}</span>}
                </span>
                <span className="absolute top-full mt-0.5 font-mono text-xs leading-none whitespace-nowrap text-foreground-muted">
                  {answers[i]?.[0]}
                </span>
              </span>
            );
          }}
        />
      </div>
    </div>
  );
}
