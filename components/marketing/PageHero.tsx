import { InkPanel } from '@/components/marketing/InkPanel';
import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { Container } from '@/components/ui/Container';

/**
 * Ink header panel for inner pages. `children` renders under the lead (chips, meta…).
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
    <section className="pt-4 md:pt-6">
      <Container>
        <InkPanel
          className={`px-6 sm:px-12 lg:px-20 ${compact ? 'py-12 md:py-14' : 'py-16 md:py-24'}`}
        >
          <div className="flex max-w-3xl flex-col gap-6">
            <Eyebrow inverse>{eyebrow}</Eyebrow>
            <Heading as="h1" size={compact ? 'lg' : 'xl'} inverse>
              <Accent text={heading} />
            </Heading>
            {lead && (
              <Text variant="lead" inverse className="max-w-2xl">
                {lead}
              </Text>
            )}
            {children && <div className="pt-4">{children}</div>}
          </div>
        </InkPanel>
      </Container>
    </section>
  );
}
