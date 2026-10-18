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
    <section id={id} className={`py-section scroll-mt-16 ${className ?? ''}`}>
      {children}
    </section>
  );
}
