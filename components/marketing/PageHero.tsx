import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';

/**
 * Light header for inner pages. `children` renders under the lead (chips, meta…).
 * `compact` keeps task pages (booking) above the fold.
 */
export function PageHero({
  eyebrow,
  heading,
  lead,
  compact = false,
  children,
}: {
  eyebrow: string;
  heading: string;
  lead?: string;
  compact?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <Container
        className={compact ? 'pt-12 pb-10 md:pt-16 md:pb-12' : 'pt-16 pb-14 md:pt-24 md:pb-20'}
      >
        <div className="flex max-w-3xl flex-col gap-6">
          <Eyebrow className="animate-rise">{eyebrow}</Eyebrow>
          <Heading as="h1" size={compact ? 'lg' : 'xl'} className="animate-rise rise-step-1">
            <Accent text={heading} />
          </Heading>
          {lead && (
            <Text variant="lead" className="max-w-2xl animate-rise rise-step-2">
              {lead}
            </Text>
          )}
          {children && <div className="animate-rise pt-4 rise-step-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}
