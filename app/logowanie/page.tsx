import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { StudentAreaComingSoon } from '@/components/auth/StudentAreaComingSoon';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { STUDENT_AREA_ENABLED } from '@/lib/student-area';

export const metadata = buildMetadata({
  title: 'Logowanie – strefa ucznia | Angleo',
  description: 'Zaloguj się do strefy ucznia Angleo, aby zobaczyć swoje słówka i ćwiczenia.',
  path: '/logowanie',
  noindex: true,
});

export default function LoginPage() {
  if (!STUDENT_AREA_ENABLED) {
    return (
      <MainLayout>
        <StudentAreaComingSoon />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <AuthShell
        eyebrow="Strefa ucznia"
        heading="Witaj *ponownie.*"
        lead="Zaloguj się, aby zobaczyć swoje słówka i ćwiczenia."
        footer={
          <>
            Nie masz konta?{' '}
            <Link
              href="/rejestracja"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Załóż je
            </Link>
          </>
        }
      >
        <Suspense>
          <LoginForm />
        </Suspense>
      </AuthShell>
    </MainLayout>
  );
}
