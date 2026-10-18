import { Container } from '@/components/ui/Container';

export function PanelSkeleton() {
  return (
    <div aria-hidden>
      <section className="border-b border-border">
        <Container className="flex flex-col gap-4 pt-12 pb-10 md:pt-16">
          <div className="h-3 w-32 animate-pulse rounded-full bg-surface-muted motion-reduce:animate-none" />
          <div className="h-14 w-72 animate-pulse rounded-2xl bg-surface-muted motion-reduce:animate-none" />
        </Container>
      </section>
      <Container className="grid gap-4 py-section sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-3xl bg-surface-muted motion-reduce:animate-none"
          />
        ))}
      </Container>
    </div>
  );
}
