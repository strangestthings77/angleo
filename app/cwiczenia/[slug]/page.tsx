import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PublicExercisePlayer } from '@/components/exercises/PublicExercisePlayer';
import { Container } from '@/components/ui/Container';
import { getPublicExercise, publicExercises } from '@/lib/public-exercises';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';

export function generateStaticParams() {
  return publicExercises.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const exercise = getPublicExercise((await params).slug);
  return buildMetadata({
    title: `${exercise?.title ?? 'Ćwiczenie'} | Angleo`,
    description: exercise?.description ?? 'Interaktywne ćwiczenie Business English.',
    path: `/cwiczenia/${exercise?.slug ?? ''}`,
  });
}

export default async function ExercisePage({ params }: { params: Promise<{ slug: string }> }) {
  const exercise = getPublicExercise((await params).slug);
  if (!exercise) notFound();
  return (
    <MainLayout>
      <section className="pt-12 pb-section md:pt-20">
        <Container className="max-w-3xl">
          <div className="mb-8 flex flex-col gap-4">
            <Link href="/cwiczenia" className="text-sm text-foreground-muted hover:text-foreground">
              ← Wszystkie ćwiczenia
            </Link>
            <p className="text-sm font-medium tracking-eyebrow text-accent uppercase">
              {exercise.difficulty} · {exercise.time}
            </p>
            <h1 className="font-serif text-display-sm tracking-display text-foreground">
              {exercise.title}
            </h1>
            <p className="text-lead text-foreground-muted">{exercise.description}</p>
          </div>
          <PublicExercisePlayer exercise={exercise} />
        </Container>
      </section>
    </MainLayout>
  );
}
