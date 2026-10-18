export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`max-w-content px-container mx-auto ${className ?? ''}`}>{children}</div>;
}
