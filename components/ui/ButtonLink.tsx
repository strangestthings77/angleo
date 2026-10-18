type Variant = 'primary' | 'secondary';
const variants: Record<Variant, string> = {
  primary: 'bg-accent text-accent-foreground hover:bg-accent/90',
  secondary: 'border border-border bg-background text-foreground hover:bg-surface',
};

export function ButtonLink({
  href,
  variant = 'primary',
  external = false,
  children,
}: {
  href: string;
  variant?: Variant;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={`focus-visible:outline-accent inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${variants[variant]}`}
    >
      {children}
    </a>
  );
}
