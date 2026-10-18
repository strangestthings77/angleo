/** Small uppercase label above headings, with a short brass rule. */
export function Eyebrow({
  inverse = false,
  className,
  children,
}: {
  inverse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p
      className={`flex items-center gap-3 text-xs font-medium tracking-eyebrow uppercase ${inverse ? 'text-accent-light' : 'text-accent'} ${className ?? ''}`}
    >
      <span aria-hidden className="h-px w-8 bg-current" />
      {children}
    </p>
  );
}
