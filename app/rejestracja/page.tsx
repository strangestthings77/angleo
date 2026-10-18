import Link from 'next/link';
import { AuthShell } from '@/components/auth/AuthShell';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { MainLayout } from '@/layouts/MainLayout';
import { buildMetadata } from '@/lib/metadata';

export const metadata = buildMetadata({
  title: 'Załóż konto – strefa ucznia | Angleo',
  description: 'Załóż konto w strefie ucznia Angleo i miej słówka oraz ćwiczenia w jednym miejscu.',
  path: '/rejestracja',
  noindex: true,
});

export default function SignUpPage() {
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
