type Variant = 'body' | 'muted' | 'lead' | 'inverse';
const variants: Record<Variant, string> = {
  body: 'text-base text-foreground',
  muted: 'text-base text-foreground-muted',
  lead: 'text-lg text-foreground-muted sm:text-xl',
  inverse: 'text-base text-background/80',
};

export function Text({
  variant = 'body',
  className,
  children,
}: {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
}) {
  return <p className={`${variants[variant]} ${className ?? ''}`}>{children}</p>;
}
