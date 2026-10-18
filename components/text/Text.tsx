type Variant = 'lead' | 'body';
const variants: Record<Variant, string> = {
  lead: 'text-lead',
  body: 'text-base/7',
};

export function Text({
  variant = 'body',
  inverse = false,
  className,
  children,
}: {
  variant?: Variant;
  inverse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const tone = inverse ? 'text-inverse-muted' : 'text-foreground-muted';
  return <p className={`${variants[variant]} ${tone} ${className ?? ''}`}>{children}</p>;
}
