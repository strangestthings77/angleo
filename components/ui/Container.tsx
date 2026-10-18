export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto max-w-content px-container ${className ?? ''}`}>{children}</div>;
}
