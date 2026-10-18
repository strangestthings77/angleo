import Link from 'next/link';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';

/** Centered card for login / sign-up. */
export function AuthShell({
  eyebrow,
  heading,
  lead,
  footer,
  children,
}: {
  eyebrow: string;
  heading: string;
  lead: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="py-16 md:py-24">
      <Container className="flex justify-center">
        <div className="flex w-full max-w-md flex-col gap-8">
          <div className="flex animate-rise flex-col gap-4 text-center">
            <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
            <Heading as="h1" size="lg">
              <Accent text={heading} />
            </Heading>
            <Text>{lead}</Text>
          </div>
          <div className="animate-pop rounded-3xl border border-border bg-surface p-6 shadow-card rise-step-2 sm:p-8">
            {children}
          </div>
          <p className="animate-rise text-center text-sm text-foreground-muted rise-step-3">
            {footer}
          </p>
          <Link
            href="/"
            className="animate-rise text-center text-xs text-foreground-muted underline-offset-4 rise-step-4 hover:text-foreground hover:underline"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </Container>
    </section>
  );
}
