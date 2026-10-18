import { LevelBar } from '@/components/progress/LevelBar';
import { pluralForm } from '@/lib/blog';
import { progressFor } from '@/lib/progress';

/** Compact level + bar for the panel header, next to the student's name. */
export function ProgressInline({ lessons }: { lessons: number }) {
  const progress = progressFor(lessons);
  const left = `${progress.toNext} ${pluralForm(progress.toNext, ['lekcja', 'lekcje', 'lekcji'])}`;

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <p className="font-serif text-title leading-none tracking-display text-foreground">
        Poziom <em className="text-accent">{progress.level}</em>
      </p>
      <div className="w-full max-w-64 min-w-40 flex-1 sm:flex-none">
        <LevelBar progress={progress} size="sm" />
      </div>
      <p className="text-xs text-foreground-muted tabular-nums">
        {progress.inLevel}/10 · jeszcze {left} do poziomu {progress.level + 1}
      </p>
    </div>
  );
}
