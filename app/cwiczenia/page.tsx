import Link from 'next/link';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { publicExercises } from '@/lib/public-exercises';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Ćwiczenia Business English | Angleo',
  description:
    'Krótkie, interaktywne ćwiczenia z angielskiego, którego naprawdę używa się w pracy.',
  path: '/cwiczenia',
});

export default function ExercisesPage() {
  return (
    <MainLayout>
      <section className="pt-14 pb-section md:pt-20">
        <Container className="flex flex-col gap-12">
          <SectionHeader
            eyebrow="Business English"
            heading="Business English w praktyce."
            lead="Krótkie, interaktywne ćwiczenia z angielskiego, którego naprawdę używa się w pracy. Bez logowania, bez podręczników — po prostu spróbuj!"
          />
          <div className="grid gap-5 md:grid-cols-2">
            {publicExercises.map((exercise) => (
              <article
                key={exercise.slug}
                className="flex flex-col gap-5 rounded-3xl border border-border bg-surface p-6 shadow-card sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-serif text-title tracking-display text-foreground">
                    {exercise.title}
                  </h2>
                  <span className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-foreground-muted">
                    {exercise.difficulty}
                  </span>
                </div>
                <p className="text-sm/6 text-foreground-muted">{exercise.description}</p>
                <div className="mt-auto flex items-center justify-between pt-3 text-sm text-foreground-muted">
                  <span>{exercise.time} · 8 pytań</span>
                  <Link
                    href={`/cwiczenia/${exercise.slug}`}
                    className="font-medium text-foreground underline decoration-accent underline-offset-4"
                  >
                    Rozpocznij →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>
    </MainLayout>
  );
}
