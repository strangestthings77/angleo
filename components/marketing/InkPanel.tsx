/** Inset ink-navy panel with film grain — the signature surface for heroes and CTAs. */
export function InkPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative isolate overflow-hidden rounded-4xl bg-foreground text-background ${className ?? ''}`}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-15 mix-blend-soft-light"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-linear-to-r from-transparent via-accent-light/50 to-transparent"
      />
      {children}
    </div>
  );
}
