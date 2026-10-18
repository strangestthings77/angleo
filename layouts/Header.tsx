import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';

export function Header() {
  return (
    <header className="border-b border-border bg-background py-7.5">
      <Container className="flex flex-col items-center gap-6">
        <Link href="/" className="text-logo font-bold text-foreground">
          {site.name}
        </Link>
        <nav aria-label="Główna nawigacja">
          <ul className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-block rounded-full p-3 text-base/5 font-bold tracking-label text-foreground hover:text-foreground/60"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Button href={site.cta.href}>{site.cta.label}</Button>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}
