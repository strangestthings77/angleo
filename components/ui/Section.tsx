export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-section ${className ?? ''}`}>
      {children}
    </section>
  );
}
