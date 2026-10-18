import { Accent } from '@/components/text/Accent';
import { Eyebrow } from '@/components/text/Eyebrow';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';

export function SectionHeader({
  eyebrow,
  heading,
  lead,
  as = 'h2',
  size = 'md',
  inverse = false,
  action,
}: {
  eyebrow: string;
  heading: string;
  lead?: string;
  as?: 'h1' | 'h2';
  size?: 'xl' | 'lg' | 'md';
  inverse?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <div className="flex max-w-3xl flex-col gap-5">
        <Eyebrow inverse={inverse}>{eyebrow}</Eyebrow>
        <Heading as={as} size={size} inverse={inverse}>
          <Accent text={heading} />
        </Heading>
        {lead && (
          <Text variant="lead" inverse={inverse} className="max-w-2xl">
            {lead}
          </Text>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
