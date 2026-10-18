import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';

/** Static row of what the lessons cover — no marquee; alternating ink/brass so wraps stay clean. */
export function Specialties() {
  return (
    <section aria-label="Specjalizacje" className="py-14 md:py-20">
      <Container>
        <ul className="flex flex-wrap items-baseline justify-center gap-x-8 gap-y-2 text-center font-serif text-title italic sm:gap-x-12 sm:text-display-sm">
          {site.specialties.map((item, i) => (
            <li key={item} className={i % 2 ? 'text-accent' : 'text-foreground/80'}>
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
