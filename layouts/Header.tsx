import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ButtonLink } from '@/components/ui/ButtonLink';
import { site } from '@/content/site';

export function Header() {
  return (
    <header className="border-border bg-background/90 sticky top-0 z-10 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-display text-2xl font-semibold tracking-tight">
          {site.name}
        </Link>
        <nav aria-label="Główna nawigacja" className="flex items-center gap-6">
          <ul className="hidden items-center gap-6 text-sm sm:flex">
            {site.nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-foreground-muted hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href={site.contact.calendarUrl} external>
            Umów lekcję
          </ButtonLink>
        </nav>
      </Container>
    </header>
  );
}
