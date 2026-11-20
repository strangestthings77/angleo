import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { StudentAreaComingSoon } from '@/components/auth/StudentAreaComingSoon';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';
import { redirect } from 'next/navigation';
import { SIGN_UP_ENABLED, STUDENT_AREA_ENABLED } from '@/lib/student-area';

export const metadata = buildMetadata({
  title: 'Załóż konto – strefa ucznia | Angleo',
  description: 'Załóż konto w strefie ucznia Angleo i miej słówka oraz ćwiczenia w jednym miejscu.',
  path: '/rejestracja',
  noindex: true,
});

export default function SignUpPage() {
  if (!STUDENT_AREA_ENABLED) {
    return (
      <MainLayout>
        <StudentAreaComingSoon />
      </MainLayout>
    );
  }
  // Accounts are created by Nicole; the proxy already redirects, this covers direct renders.
  if (!SIGN_UP_ENABLED) redirect('/logowanie');

  return (
    <MainLayout>
      <AuthShell
        eyebrow="Strefa ucznia"
        heading="Załóż *konto.*"
        lead="Twoje słówka i ćwiczenia w jednym miejscu."
        footer={
          <>
            Masz już konto?{' '}
            <Link
              href="/logowanie"
              className="font-medium text-foreground underline underline-offset-4"
            >
              Zaloguj się
            </Link>
          </>
        }
      >
        <SignUpForm />
      </AuthShell>
    </MainLayout>
  );
}
