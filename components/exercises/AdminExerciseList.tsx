import Link from 'next/link';
import { deleteExercise, reopenExercise } from '@/lib/admin-actions';
import type { Exercise } from '@/lib/exercises';

export function exerciseStatus(e: Exercise): { label: string; tone: 'new' | 'progress' | 'done' } {
  if (e.attempt?.submittedAt)
    return { label: `Oddane · ${e.attempt.score}/${e.attempt.total}`, tone: 'done' };
  const filled = Object.values(e.attempt?.answers ?? {}).filter((v) => v.trim()).length;
  if (filled > 0) return { label: `W trakcie · ${filled}/${e.gaps}`, tone: 'progress' };
  return { label: 'Nowe', tone: 'new' };
}

const toneClass = {
  new: 'bg-surface-muted text-foreground-muted',
  progress: 'bg-accent/10 text-accent',
  done: 'bg-success/10 text-success',
};

const small =
  'inline-flex h-9 items-center rounded-full border border-border px-3 text-xs text-foreground-muted transition-colors duration-150 hover:border-foreground/50 hover:text-foreground';

export function AdminExerciseList({
  studentId,
  exercises,
}: {
  studentId: string;
  exercises: Exercise[];
}) {
  if (exercises.length === 0) {
    return <p className="text-sm text-foreground-muted">Brak ćwiczeń — dodaj pierwsze.</p>;
  }
  return (
    <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
      {exercises.map((exercise) => {
        const status = exerciseStatus(exercise);
        return (
          <li key={exercise.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex flex-col gap-1">
              <p className="font-medium text-foreground">{exercise.title}</p>
              <span
                className={`self-start rounded-full px-2.5 py-1 text-xs tabular-nums ${toneClass[status.tone]}`}
              >
                {status.label}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/uczniowie/${studentId}/cwiczenia/${exercise.id}`}
                className="inline-flex h-9 items-center rounded-full bg-foreground px-4 text-xs font-medium text-background transition-colors duration-150 hover:bg-foreground/85"
              >
                Podgląd na żywo
              </Link>
              {exercise.attempt?.submittedAt && (
                <form action={reopenExercise.bind(null, exercise.id, studentId)}>
                  <button type="submit" className={small}>
                    Pozwól poprawić
                  </button>
                </form>
              )}
              <form action={deleteExercise.bind(null, exercise.id, studentId)}>
                <button type="submit" className={small} aria-label={`Usuń „${exercise.title}”`}>
                  Usuń
                </button>
              </form>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
