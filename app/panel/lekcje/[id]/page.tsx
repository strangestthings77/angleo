import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { LessonEditor } from '@/components/lessons/LessonEditor';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { MainLayout } from '@/layouts/MainLayout';
import { requireUser } from '@/lib/auth';
import { getMyLesson } from '@/lib/lessons';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Lekcja – strefa ucznia | Angleo',
  description: 'Wspólne notatki z lekcji w strefie ucznia Angleo.',
  path: '/panel',
  noindex: true,
});

type Params = PageProps<'/panel/lekcje/[id]'>['params'];

export default function LessonPage({ params }: { params: Params }) {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <StudentLesson params={params} />
      </Suspense>
    </MainLayout>
  );
}

async function StudentLesson({ params }: { params: Params }) {
  const { id } = await params;
  const user = await requireUser(`/panel/lekcje/${id}`);
  const lesson = await getMyLesson(id);
  if (!lesson) notFound();

  return (
    <Container className="flex flex-col gap-8 pt-10 pb-section md:pt-14">
      <Link
        href="/panel#lekcje"
        className="animate-rise self-start text-sm text-foreground-muted hover:text-foreground"
      >
        ← Strefa ucznia
      </Link>
      <div className="flex animate-rise flex-col gap-3 rise-step-1">
        <Eyebrow>Notatki z lekcji</Eyebrow>
        <Heading as="h1" size="md">
          Lekcja <em>{lesson.number}</em>
        </Heading>
        {lesson.topic && <p className="text-lead text-foreground-muted">{lesson.topic}</p>}
      </div>
      <div className="animate-rise rise-step-2">
        <LessonEditor
          lessonId={lesson.id}
          userId={user.id}
          initialContent={lesson.content}
          otherName={site.owner.split(' ')[0]}
        />
      </div>
    </Container>
  );
}
