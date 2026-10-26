import Link from 'next/link';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { publicExercises } from '@/lib/public-exercises';

export function ExercisesPreview() {
  return (
    <section className="py-section">
      <Container className="flex flex-col gap-10">
        <SectionHeader
          eyebrow="Ćwiczenia"
          heading="Sprawdź swój Business English w praktyce."
          lead="Kilka minut, prawdziwe sytuacje z pracy i angielski, który naprawdę się przydaje."
          action={
            <Link
              href="/cwiczenia"
              className="text-sm font-medium text-foreground underline decoration-accent underline-offset-4"
            >
              Zobacz wszystkie ćwiczenia →
            </Link>
          }
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {publicExercises.slice(0, 3).map((exercise) => (
            <Link
              key={exercise.slug}
              href={`/cwiczenia/${exercise.slug}`}
              className="rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-foreground"
            >
              <h3 className="font-serif text-title tracking-display text-foreground">
                {exercise.title}
              </h3>
              <p className="mt-2 text-sm text-foreground-muted">{exercise.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
