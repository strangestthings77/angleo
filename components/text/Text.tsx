type Variant = 'body' | 'small' | 'label';
const variants: Record<Variant, string> = {
  body: 'text-base/7 text-foreground-muted',
  small: 'text-sm/6 text-foreground-muted',
  label: 'text-sm font-bold tracking-label text-foreground-muted uppercase',
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
