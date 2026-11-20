import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { DeleteLessonButton } from '@/components/lessons/DeleteLessonButton';
import { LessonEditor } from '@/components/lessons/LessonEditor';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { MainLayout } from '@/layouts/MainLayout';
import { getStudent, requireAdmin } from '@/lib/auth';
import { lessonTitle } from '@/lib/lesson';
import { getStudentLesson } from '@/lib/lessons';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Lekcja – panel administratora | Angleo',
  description: 'Wspólne notatki z lekcji w panelu administratora Angleo.',
  path: '/admin',
  noindex: true,
});

type Params = PageProps<'/admin/uczniowie/[id]/lekcje/[lessonId]'>['params'];

export default function AdminLessonPage({ params }: { params: Params }) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <AdminLesson params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function AdminLesson({ params }: { params: Params }) {
  const { id, lessonId } = await params;
  const admin = await requireAdmin();
  const [student, lesson] = await Promise.all([getStudent(id), getStudentLesson(id, lessonId)]);
  if (!student || !lesson) notFound();
  const studentName = student.name ?? student.email;

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-section md:pt-14">
      <Link
        href={`/admin/uczniowie/${student.id}`}
        className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
      >
        ← {studentName}
      </Link>
      <div className="flex animate-rise flex-col gap-4 rise-step-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-3">
          <Eyebrow>{studentName}</Eyebrow>
          <Heading as="h1" size="md">
            Lekcja <em>{lesson.number}</em>
          </Heading>
          {lesson.topic && <p className="text-lead text-foreground-muted">{lesson.topic}</p>}
        </div>
        <DeleteLessonButton
          lessonId={lesson.id}
          studentId={student.id}
          title={lessonTitle(lesson)}
          className="inline-flex h-9 items-center self-start rounded-full border border-border px-3 text-xs text-foreground-muted transition-colors duration-150 hover:border-foreground/50 hover:text-foreground sm:self-auto"
        />
      </div>
      <div className="animate-rise rise-step-2">
        <LessonEditor
          lessonId={lesson.id}
          userId={admin.id}
          initialContent={lesson.content}
          otherName={student.name?.split(' ')[0] ?? 'Uczeń'}
        />
      </div>
    </Container>
  );
}
