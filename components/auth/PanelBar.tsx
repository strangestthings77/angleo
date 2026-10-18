import Link from 'next/link';
import { ProgressInline } from '@/components/progress/ProgressInline';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import type { CurrentUser } from '@/lib/auth';
import { signOut } from '@/lib/auth-actions';

/** Greeting + account actions at the top of the student/admin area. */
export function PanelBar({
  user,
  area,
  showProgress = false,
}: {
  user: CurrentUser;
  area: 'student' | 'admin';
  /** Level + bar under the greeting (student view). */
  showProgress?: boolean;
}) {
  const firstName = user.name?.split(' ')[0];
  const link =
    'inline-flex h-10 items-center rounded-full border border-border px-4 text-sm text-foreground transition-colors duration-200 hover:border-foreground/50';

  return (
    <section className="border-b border-border">
      <Container className="flex flex-col gap-6 pt-12 pb-10 md:flex-row md:items-end md:justify-between md:pt-16">
        <div className="flex animate-rise flex-col gap-4">
          <Eyebrow>{area === 'admin' ? 'Panel administratora' : 'Strefa ucznia'}</Eyebrow>
          <Heading as="h1" size="lg">
            Cześć
            {firstName ? (
              <>
                , <em>{firstName}!</em>
              </>
            ) : (
              <em>!</em>
            )}
          </Heading>
          <p className="text-sm text-foreground-muted">
            {user.email}
            <span className="ml-3 rounded-full bg-surface-muted px-2.5 py-1 text-xs text-foreground">
              {user.role === 'admin' ? 'Administrator' : 'Uczeń'}
            </span>
          </p>
          {showProgress && (
            <div className="mt-2">
              <ProgressInline lessons={user.lessons} />
            </div>
          )}
        </div>
        <div className="flex animate-rise flex-wrap gap-2 rise-step-2">
          {user.role === 'admin' && (
            <Link href={area === 'admin' ? '/panel' : '/admin'} className={link}>
              {area === 'admin' ? 'Widok ucznia' : 'Panel administratora'}
            </Link>
          )}
          <form action={signOut}>
            <button type="submit" className={link}>
              Wyloguj
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
