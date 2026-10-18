import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { ExercisePlayer } from '@/components/exercises/ExercisePlayer';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { isGapCorrect } from '@/lib/exercise';
import { answersFor, getMyExercise } from '@/lib/exercises';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Ćwiczenie – strefa ucznia | Angleo',
  description: 'Ćwiczenie z angielskiego biznesowego w strefie ucznia Angleo.',
  path: '/panel',
  noindex: true,
});

type Params = PageProps<'/panel/cwiczenia/[id]'>['params'];

export default function ExercisePage({ params }: { params: Params }) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <StudentExercise params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function StudentExercise({ params }: { params: Params }) {
  const { id } = await params;
  const exercise = await getMyExercise(id);
  if (!exercise) notFound();

  // Already submitted → rebuild the result (answers are only readable after submitting).
  const attempt = exercise.attempt;
  const answers = attempt?.submittedAt ? await answersFor(exercise.id) : null;
  const initialResult =
    attempt?.submittedAt && answers
      ? {
          score: attempt.score ?? 0,
          total: attempt.total ?? exercise.gaps,
          results: exercise.hints.map((_, i) =>
            isGapCorrect(attempt.answers[i] ?? '', answers[i] ?? []),
          ),
          answers,
        }
      : null;

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-section md:pt-14">
      <Link
        href="/panel#cwiczenia"
        className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
      >
        ← Strefa ucznia
      </Link>
      <div className="flex animate-rise flex-col gap-3 rise-step-1">
        <Eyebrow>Ćwiczenie</Eyebrow>
        <Heading as="h1" size="md">
          {exercise.title}
        </Heading>
        {exercise.instructions && (
          <p className="text-lead text-foreground-muted">{exercise.instructions}</p>
        )}
      </div>
      <ExercisePlayer
        exerciseId={exercise.id}
        hints={exercise.hints}
        template={exercise.template}
        initialAnswers={attempt?.answers ?? {}}
        initialResult={initialResult}
      />
    </Container>
  );
}
