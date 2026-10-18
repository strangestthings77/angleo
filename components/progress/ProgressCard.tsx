import { Eyebrow } from '@/components/text/Eyebrow';
import { LevelBar } from '@/components/progress/LevelBar';
import { pluralForm } from '@/lib/blog';
import { progressFor } from '@/lib/progress';

const lessonsWord = (n: number) => pluralForm(n, ['lekcja', 'lekcje', 'lekcji']);

/** Student's level card on /panel. */
export function ProgressCard({ lessons }: { lessons: number }) {
  const progress = progressFor(lessons);

  return (
    <section className="flex animate-pop flex-col gap-8 rounded-3xl border border-border bg-surface p-6 shadow-card rise-step-2 sm:p-10">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-3">
          <Eyebrow>Twój postęp</Eyebrow>
          <p className="font-serif text-display-md leading-none tracking-display text-foreground">
            Poziom <em className="text-accent">{progress.level}</em>
          </p>
        </div>
        <dl className="flex gap-8 text-sm">
          <div>
            <dt className="text-foreground-muted">Ukończone</dt>
            <dd className="font-serif text-title text-foreground tabular-nums">
              {progress.lessons} {lessonsWord(progress.lessons)}
            </dd>
          </div>
          <div>
            <dt className="text-foreground-muted">Do poziomu {progress.level + 1}</dt>
            <dd className="font-serif text-title text-foreground tabular-nums">
              {progress.toNext} {lessonsWord(progress.toNext)}
            </dd>
          </div>
        </dl>
      </div>
      <div className="flex flex-col gap-3">
        <LevelBar progress={progress} />
        <p className="text-xs text-foreground-muted tabular-nums">
          {progress.inLevel} / 10 lekcji na poziomie {progress.level}
        </p>
      </div>
    </section>
  );
}
