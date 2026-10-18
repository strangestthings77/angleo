import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { getStudent } from '@/lib/auth';
import { toSource } from '@/lib/exercise';
import { answersFor, getExerciseForAdmin } from '@/lib/exercises';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Edycja ćwiczenia – panel administratora | Angleo',
  description: 'Edycja ćwiczenia z lukami dla ucznia w panelu administratora Angleo.',
  path: '/admin',
  noindex: true,
});

type Params = PageProps<'/admin/uczniowie/[id]/cwiczenia/[exerciseId]/edytuj'>['params'];

export default function EditExercisePage({ params }: { params: Params }) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <EditExercise params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function EditExercise({ params }: { params: Params }) {
  const { id, exerciseId } = await params;
  const [student, exercise] = await Promise.all([getStudent(id), getExerciseForAdmin(exerciseId)]);
  if (!student || !exercise || exercise.studentId !== student.id) notFound();
  const answers = (await answersFor(exercise.id)) ?? [];
  const source = toSource({ template: exercise.template, hints: exercise.hints, answers });
  const { attempt } = exercise;

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-section md:pt-14">
      <Link
        href={`/admin/uczniowie/${student.id}`}
        className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
      >
        ← {student.name ?? student.email}
      </Link>
      <div className="flex animate-rise flex-col gap-3 rise-step-1">
        <Eyebrow>Edycja ćwiczenia</Eyebrow>
        <Heading as="h1" size="md">
          {exercise.title}
        </Heading>
      </div>
      {attempt && (
        <p className="animate-rise rounded-2xl bg-accent/10 p-4 text-sm text-foreground rise-step-2">
          {attempt.submittedAt
            ? `Uczeń już oddał to ćwiczenie (${attempt.score}/${attempt.total}). Po zapisaniu wynik zostanie przeliczony według nowych odpowiedzi.`
            : 'Uczeń już zaczął to ćwiczenie. Wpisane odpowiedzi zostają przy lukach o tych samych numerach — dodając lub usuwając lukę w środku tekstu, przesuniesz je.'}
        </p>
      )}
      <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
        <ExerciseForm
          studentId={student.id}
          exercise={{
            id: exercise.id,
            title: exercise.title,
            instructions: exercise.instructions,
            source,
          }}
        />
      </div>
    </Container>
  );
}
