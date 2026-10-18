'use client';

import { useOptimistic, useState, useTransition } from 'react';
import { LevelBar } from '@/components/progress/LevelBar';
import { setStudentLessons } from '@/lib/admin-actions';
import { MAX_LESSONS, progressFor } from '@/lib/progress';

const stepButton =
  'inline-flex size-9 items-center justify-center rounded-full border border-border text-base text-foreground transition-[border-color,scale] duration-150 ease-out hover:border-foreground/50 active:scale-95 disabled:opacity-40';

/** Admin control: −/+ and an exact value, with an optimistic level bar. */
export function LessonsEditor({ studentId, lessons }: { studentId: string; lessons: number }) {
  const [saved, setSaved] = useState(lessons);
  const [optimistic, setOptimistic] = useOptimistic(saved);
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const progress = progressFor(optimistic);

  function save(next: number) {
    const value = Math.max(0, Math.min(MAX_LESSONS, Math.round(next)));
    setDraft(null);
    if (value === saved) return;
    setError(null);
    startTransition(async () => {
      setOptimistic(value);
      const result = await setStudentLessons(studentId, value);
      if ('error' in result) setError(result.error);
      else setSaved(result.lessons);
    });
  }

  return (
    <div className="flex min-w-60 flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className={stepButton}
          onClick={() => save(optimistic - 1)}
          disabled={optimistic <= 0}
          aria-label="Odejmij lekcję"
        >
          −
        </button>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={MAX_LESSONS}
          aria-label="Liczba ukończonych lekcji"
          value={draft ?? String(optimistic)}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft !== null && save(Number(draft))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') setDraft(null);
          }}
          className="h-9 w-16 rounded-lg border border-border bg-background text-center text-base text-foreground tabular-nums focus:border-foreground focus:outline-none"
        />
        <button
          type="button"
          className={stepButton}
          onClick={() => save(optimistic + 1)}
          disabled={optimistic >= MAX_LESSONS}
          aria-label="Dodaj lekcję"
        >
          +
        </button>
        <span className="ml-1 text-xs whitespace-nowrap text-foreground-muted tabular-nums">
          Poz. <span className="font-medium text-foreground">{progress.level}</span> ·{' '}
          {progress.inLevel}/10
        </span>
        {pending && (
          <span
            className="size-1.5 animate-pulse rounded-full bg-accent"
            aria-label="Zapisywanie"
          />
        )}
      </div>
      <LevelBar progress={progress} size="sm" />
      {error && (
        <p role="alert" className="animate-fade text-xs text-foreground">
          {error}
        </p>
      )}
    </div>
  );
}
