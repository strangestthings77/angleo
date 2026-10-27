import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { UserIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';
import { MobileMenu } from '@/layouts/MobileMenu';
import { PUBLIC_EXERCISES_ENABLED } from '@/lib/public-exercises';

export function Header() {
  const studentNavItem = { ...site.account, href: '/logowanie' };
  const visibleNavItems = site.nav.filter(
    (item) => PUBLIC_EXERCISES_ENABLED || item.href !== '/cwiczenia',
  );
  const menuItems = [...visibleNavItems, studentNavItem];

  return (
    <header className="sticky top-0 z-20 header-scrolled border-b border-border/70 bg-background/85 backdrop-blur-md vt-header">
      <Container className="relative flex h-18 items-center justify-between gap-8">
        <Link href="/" className="flex items-baseline gap-2 text-foreground">
          <span className="font-serif text-3xl tracking-display">{site.name}</span>
          <span className="hidden text-xs tracking-eyebrow text-foreground-muted uppercase lg:inline">
            Business English
          </span>
        </Link>
        <nav aria-label="Główna nawigacja" className="hidden items-center gap-6 md:flex lg:gap-8">
          <ul className="flex items-center gap-6 text-sm lg:gap-8">
            {visibleNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="relative text-foreground-muted transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-1 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out-soft hover:text-foreground hover:after:scale-x-100 motion-reduce:after:transition-none"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={studentNavItem.href}
            className="inline-flex items-center gap-2 text-sm text-foreground-muted transition-colors duration-200 hover:text-foreground"
          >
            <UserIcon />
            <span className="sr-only lg:not-sr-only">{studentNavItem.label}</span>
          </Link>
          <Button href={site.cta.href} className="h-10 px-5">
            {site.cta.label}
          </Button>
        </nav>
        <MobileMenu items={menuItems} cta={site.cta} />
      </Container>
    </header>
  );
}
