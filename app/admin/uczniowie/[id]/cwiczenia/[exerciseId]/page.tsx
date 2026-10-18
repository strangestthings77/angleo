import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { LiveExerciseView } from '@/components/exercises/LiveExerciseView';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { getStudent } from '@/lib/auth';
import { answersFor, getExerciseForAdmin } from '@/lib/exercises';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Podgląd ćwiczenia – panel administratora | Angleo',
  description: 'Podgląd na żywo odpowiedzi ucznia w ćwiczeniu z lukami w panelu Angleo.',
  path: '/admin',
  noindex: true,
});

type Params = PageProps<'/admin/uczniowie/[id]/cwiczenia/[exerciseId]'>['params'];

export default function LiveExercisePage({ params }: { params: Params }) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <LiveExercise params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function LiveExercise({ params }: { params: Params }) {
  const { id, exerciseId } = await params;
  const [student, exercise] = await Promise.all([getStudent(id), getExerciseForAdmin(exerciseId)]);
  if (!student || !exercise || exercise.studentId !== student.id) notFound();
  const answers = (await answersFor(exercise.id)) ?? [];

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-section md:pt-14">
      <Link
        href={`/admin/uczniowie/${student.id}`}
        className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
      >
        ← {student.name ?? student.email}
      </Link>
      <div className="flex animate-rise flex-col gap-3 rise-step-1">
        <Eyebrow>Podgląd na żywo</Eyebrow>
        <Heading as="h1" size="md">
          {exercise.title}
        </Heading>
        {exercise.instructions && <p className="text-foreground-muted">{exercise.instructions}</p>}
        <Link
          href={`/admin/uczniowie/${student.id}/cwiczenia/${exercise.id}/edytuj`}
          className="inline-flex h-9 items-center self-start rounded-full border border-border px-4 text-xs text-foreground-muted transition-colors duration-150 hover:border-foreground/50 hover:text-foreground"
        >
          Edytuj ćwiczenie
        </Link>
      </div>
      <LiveExerciseView
        exerciseId={exercise.id}
        hints={exercise.hints}
        template={exercise.template}
        answers={answers}
        initialAttempt={exercise.attempt}
      />
    </Container>
  );
}
