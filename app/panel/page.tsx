import { Suspense } from 'react';
import { PanelBar } from '@/components/auth/PanelBar';
import { PanelSkeleton } from '@/components/auth/PanelSkeleton';
import { ProgressCard } from '@/components/progress/ProgressCard';
import { WordCard } from '@/components/words/WordCard';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { BookIcon } from '@/components/ui/Icon';
import { MainLayout } from '@/layouts/MainLayout';
import { getMyWords, requireUser } from '@/lib/auth';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Strefa ucznia | Angleo',
  description: 'Twoje słówka, postęp i ćwiczenia z angielskiego biznesowego w jednym miejscu.',
  path: '/panel',
  noindex: true,
});

// Literal class names so Tailwind generates them.
const STAGGER = [
  'rise-step-0',
  'rise-step-1',
  'rise-step-2',
  'rise-step-3',
  'rise-step-4',
  'rise-step-5',
  'rise-step-6',
  'rise-step-7',
];

export default function StudentPanelPage() {
  return (
    <MainLayout>
      <Suspense fallback={<PanelSkeleton />}>
        <StudentDashboard />
      </Suspense>
    </MainLayout>
  );
}

async function StudentDashboard() {
  const user = await requireUser('/panel');
  const words = await getMyWords();

  return (
    <>
      <PanelBar user={user} area="student" />

      <Container className="flex flex-col gap-16 py-section">
        <ProgressCard lessons={user.lessons} />

        <section className="flex flex-col gap-6">
          <Eyebrow>Ćwiczenia</Eyebrow>
          <div className="flex animate-fade flex-col items-start gap-4 rounded-3xl border border-dashed border-border p-8 sm:flex-row sm:items-center">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-surface-muted text-accent">
              <BookIcon size={20} />
            </span>
            <div>
              <p className="font-medium text-foreground">Tu pojawią się Twoje ćwiczenia</p>
              <p className="text-sm text-foreground-muted">
                Po lekcji znajdziesz tutaj zadania przygotowane specjalnie dla Ciebie.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <Eyebrow>Słownik</Eyebrow>
            <Heading size="md">
              Moje <em>słówka</em>
            </Heading>
            <p className="text-sm text-foreground-muted">
              Najedź na kartę (albo ją dotknij), żeby zobaczyć tłumaczenie.
            </p>
          </div>
          {words.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-border p-8 text-foreground-muted">
              Słówka z Twoich lekcji pojawią się tutaj.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {words.map((word, i) => (
                <li
                  key={word.id}
                  className={`animate-pop ${STAGGER[Math.min(i, STAGGER.length - 1)]}`}
                >
                  <WordCard word={word} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </>
  );
}
