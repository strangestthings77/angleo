import Link from 'next/link';
import { exerciseStatus } from '@/components/exercises/AdminExerciseList';
import { ArrowRightIcon, BookIcon } from '@/components/ui/Icon';
import type { Exercise } from '@/lib/exercises';

const toneClass = {
  new: 'bg-accent text-background',
  progress: 'bg-accent/10 text-accent',
  done: 'bg-success/10 text-success',
};

export function StudentExerciseList({ exercises }: { exercises: Exercise[] }) {
  if (exercises.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-dashed border-border p-8 sm:flex-row sm:items-center">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
          <BookIcon size={20} />
        </span>
        <div>
          <p className="font-medium text-foreground">Tu pojawią się Twoje ćwiczenia</p>
          <p className="text-sm text-foreground-muted">
            Po lekcji znajdziesz tutaj zadania przygotowane specjalnie dla Ciebie.
          </p>
        </div>
      </div>
    );
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {exercises.map((exercise) => {
        const status = exerciseStatus(exercise);
        return (
          <li key={exercise.id}>
            <Link
              href={`/panel/cwiczenia/${exercise.id}`}
              className="group flex h-full flex-col gap-4 rounded-3xl border border-border bg-surface p-6 transition-[translate,box-shadow] duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-card motion-reduce:transition-none"
            >
              <span
                className={`self-start rounded-full px-2.5 py-1 text-xs tabular-nums ${toneClass[status.tone]}`}
              >
                {status.label}
              </span>
              <span className="font-serif text-title tracking-display text-foreground">
                {exercise.title}
              </span>
              {exercise.instructions && (
                <span className="text-sm text-foreground-muted">{exercise.instructions}</span>
              )}
              <span className="mt-auto inline-flex items-center gap-2 text-sm font-medium text-accent">
                {status.tone === 'done'
                  ? 'Zobacz wynik'
                  : status.tone === 'progress'
                    ? 'Kontynuuj'
                    : 'Zacznij'}
                <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
