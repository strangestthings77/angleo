import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { LessonsEditor } from '@/components/progress/LessonsEditor';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { AddWordForm } from '@/components/words/AddWordForm';
import { AdminExerciseList } from '@/components/exercises/AdminExerciseList';
import { ExerciseForm } from '@/components/exercises/ExerciseForm';
import { MainLayout } from '@/layouts/MainLayout';
import { deleteWord } from '@/lib/admin-actions';
import { getStudent, getStudentWords } from '@/lib/auth';
import { getStudentExercises } from '@/lib/exercises';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Uczeń – panel administratora | Angleo',
  description: 'Postęp i słówka ucznia w panelu administratora Angleo.',
  path: '/admin',
  noindex: true,
});

const dateFormat = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Warsaw',
});

export default function StudentPage({ params }: PageProps<'/admin/uczniowie/[id]'>) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <StudentDetail params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function StudentDetail({ params }: { params: PageProps<'/admin/uczniowie/[id]'>['params'] }) {
  const { id } = await params;
  // getStudent() runs requireAdmin() — non-admins are redirected before any data is read.
  const student = await getStudent(id);
  if (!student) notFound();
  const [words, exercises] = await Promise.all([
    getStudentWords(student.id),
    getStudentExercises(student.id),
  ]);

  return (
    <>
      <section className="border-b border-border">
        <Container className="flex flex-col gap-6 pt-10 pb-10 md:pt-14">
          <Link
            href="/admin"
            className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
          >
            ← Wszyscy uczniowie
          </Link>
          <div className="flex animate-rise flex-col gap-3 rise-step-1">
            <Eyebrow>Uczeń</Eyebrow>
            <Heading as="h1" size="lg">
              {student.name ?? student.email}
            </Heading>
            <p className="text-sm text-foreground-muted">
              {student.email} · dołączył(a) {dateFormat.format(new Date(student.createdAt))}
            </p>
          </div>
        </Container>
      </section>

      <Container className="flex flex-col gap-16 py-section">
        <section className="flex flex-col gap-6">
          <ProgressCard lessons={student.lessons} />
          <div className="flex flex-col gap-3 rounded-3xl border border-border p-6">
            <p className="text-sm font-medium text-foreground">Zmień liczbę ukończonych lekcji</p>
            <LessonsEditor studentId={student.id} lessons={student.lessons} />
          </div>
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            <Eyebrow>Ćwiczenia ucznia</Eyebrow>
            <Heading size="sm">
              Dodaj <em>ćwiczenie</em>
            </Heading>
            <p className="text-sm text-foreground-muted">
              Tekst z lukami do uzupełnienia. W „Podgląd na żywo” widzisz, co uczeń wpisuje.
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <ExerciseForm studentId={student.id} />
            </div>
            <AdminExerciseList studentId={student.id} exercises={exercises} />
          </div>
        </section>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Eyebrow>Słówka ucznia</Eyebrow>
              <Heading size="sm">
                Dodaj <em>słówko</em>
              </Heading>
              <p className="text-sm text-foreground-muted">
                Uczeń zobaczy je w „Moje słówka” i w teście. Test wybacza brak polskich znaków i
                drobne literówki.
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-surface p-6 sm:p-8">
              <AddWordForm studentId={student.id} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <p className="text-sm text-foreground-muted">
              {words.length === 0 ? 'Brak słówek — dodaj pierwsze.' : `Słówka (${words.length})`}
            </p>
            {words.length > 0 && (
              <ul className="divide-y divide-border overflow-hidden rounded-3xl border border-border bg-surface">
                {words.map((word) => (
                  <li
                    key={word.id}
                    className="flex animate-fade items-start justify-between gap-4 p-5"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="font-serif text-title tracking-display text-foreground">
                        {word.term}
                      </p>
                      <p className="text-sm text-accent">{word.translation}</p>
                      {word.example && (
                        <p className="text-sm text-foreground-muted italic">{word.example}</p>
                      )}
                    </div>
                    <form action={deleteWord.bind(null, word.id, student.id)}>
                      <button
                        type="submit"
                        aria-label={`Usuń „${word.term}”`}
                        className="inline-flex h-9 shrink-0 items-center rounded-full border border-border px-3 text-xs text-foreground-muted transition-colors duration-150 hover:border-foreground/50 hover:text-foreground"
                      >
                        Usuń
                      </button>
                    </form>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </Container>
    </>
  );
}
