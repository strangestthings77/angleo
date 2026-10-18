import Link from 'next/link';
import { Suspense } from 'react';
import { AuthShell } from '@/components/auth/AuthShell';
import { LoginForm } from '@/components/auth/LoginForm';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Logowanie – strefa ucznia | Angleo',
  description: 'Zaloguj się do strefy ucznia Angleo, aby zobaczyć swoje słówka i ćwiczenia.',
  path: '/logowanie',
  noindex: true,
});

export default function LoginPage() {
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
