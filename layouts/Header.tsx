import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { MobileMenu } from '@/layouts/MobileMenu';

export function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <Container className="relative flex h-18 items-center justify-between gap-8">
        <Link href="/" className="flex items-baseline gap-2 text-foreground">
          <span className="font-serif text-3xl tracking-display">{site.name}</span>
          <span className="hidden text-xs tracking-eyebrow text-foreground-muted uppercase lg:inline">
            Business English
          </span>
        </Link>
        <nav aria-label="Główna nawigacja" className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-8 text-sm">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-foreground-muted transition-colors duration-200 hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button href={site.cta.href} className="h-10 px-5">
            {site.cta.label}
          </Button>
        </nav>
        <MobileMenu items={site.nav} cta={site.cta} />
      </Container>
    </header>
  );
}
