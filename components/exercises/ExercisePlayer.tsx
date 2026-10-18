'use client';

import { useEffect, useRef, useState } from 'react';
import { ExerciseText, gapClass, gapWidth } from '@/components/exercises/ExerciseText';
import type { Answers, GapHint } from '@/lib/exercise';
import { createClient } from '@/lib/supabase/client';

type Result = { score: number; total: number; results: boolean[]; answers: string[][] };

/** Save at most this often while typing — short enough that the admin sees letters appear. */
const SAVE_EVERY_MS = 200;

/**
 * Student fills the gaps. Answers autosave (throttled, via save_exercise_answers) to
 * exercise_attempts — the admin's live view gets each save over Realtime. "Sprawdź" grades in
 * the database (submit_exercise), which also reveals the answers.
 */
export function ExercisePlayer({
  exerciseId,
  hints,
  template,
  initialAnswers,
  initialResult,
}: {
  exerciseId: string;
  hints: GapHint[];
  template: string;
  initialAnswers: Answers;
  initialResult: Result | null;
}) {
  const [supabase] = useState(() => createClient());
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [result, setResult] = useState<Result | null>(initialResult);
  const [saving, setSaving] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSave = useRef(0);
  const latest = useRef(answers);
  const locked = result !== null;

  // Opening the exercise creates the attempt, so the admin sees "otworzył(a)" right away.
  useEffect(() => {
    if (!locked) void save(latest.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on open
  }, []);

  async function save(next: Answers) {
    lastSave.current = Date.now();
    setSaving('saving');
    const { error } = await supabase.rpc('save_exercise_answers', {
      p_exercise: exerciseId,
      p_answers: next,
    });
    // A newer save may be queued; only report the state of the latest one.
    if (next === latest.current) setSaving(error ? 'error' : 'saved');
    return !error;
  }

  /** Throttle: save now if the last save was a while ago, otherwise once the window ends. */
  function change(index: number, value: string) {
    const next = { ...latest.current, [index]: value };
    latest.current = next;
    setAnswers(next);
    if (timer.current) clearTimeout(timer.current);
    const wait = Math.max(0, lastSave.current + SAVE_EVERY_MS - Date.now());
    timer.current = setTimeout(() => void save(latest.current), wait);
  }

  async function submit() {
    if (timer.current) clearTimeout(timer.current);
    setSubmitting(true);
    if (!(await save(latest.current))) {
      setSubmitting(false);
      return;
    }
    const { data, error } = await supabase.rpc('submit_exercise', { p_exercise: exerciseId });
    setSubmitting(false);
    if (error || !data) {
      setSaving('error');
      return;
    }
    setResult(data as Result);
  }

  const filled = hints.filter((_, i) => (answers[i] ?? '').trim()).length;

  return (
    <div className="flex flex-col gap-8">
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-10">
        <ExerciseText
          template={template}
          renderGap={(i) => {
            const state = result ? (result.results[i] ? 'correct' : 'wrong') : 'idle';
            return (
              <span className="relative inline-flex flex-col items-center align-baseline">
                <input
                  aria-label={`Luka ${i + 1}`}
                  value={answers[i] ?? ''}
                  onChange={(e) => change(i, e.target.value)}
                  disabled={locked}
                  placeholder={hints[i]?.pattern}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  style={{ '--gap-w': gapWidth(hints[i]) } as React.CSSProperties}
                  className={gapClass(state)}
                />
                {result && !result.results[i] && (
                  <span className="absolute top-full mt-0.5 font-mono text-xs leading-none whitespace-nowrap text-success">
                    {result.answers[i]?.[0]}
                  </span>
                )}
              </span>
            );
          }}
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {result ? (
          <p className="font-serif text-title tracking-display text-foreground tabular-nums">
            Wynik: <em className="text-accent">{result.score}</em> / {result.total}
          </p>
        ) : (
          <p className="text-sm text-foreground-muted tabular-nums" aria-live="polite">
            Uzupełniono {filled} / {hints.length}
            {' · '}
            {saving === 'saving'
              ? 'zapisuję…'
              : saving === 'error'
                ? 'nie udało się zapisać — sprawdź połączenie'
                : 'zapisane'}
          </p>
        )}
        {!result && (
          <button
            type="button"
            onClick={submit}
            disabled={submitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-sm font-medium text-background transition-[background-color,opacity,scale] duration-200 ease-out hover:bg-foreground/85 active:scale-97 disabled:opacity-60"
          >
            {submitting ? 'Sprawdzam…' : 'Sprawdź odpowiedzi'}
          </button>
        )}
      </div>
    </div>
  );
}
