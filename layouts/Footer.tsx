import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';

// Cached so the year is fixed at build time — `cacheComponents` rejects a bare `new Date()`.
async function currentYear() {
  'use cache';
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();
  const { company } = site;

  return (
    <footer className="border-t border-border bg-background">
      <Container className="flex flex-col items-center gap-10 py-14 text-center">
        <address className="flex flex-col gap-1 text-base/7 text-foreground-muted uppercase not-italic">
          <a
            href={company.linkedin}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-foreground hover:text-foreground/70"
          >
            {site.owner} - {site.role}
          </a>
          <span>{company.street}</span>
          <span>{company.city}</span>
          <span>NIP: {company.nip}</span>
        </address>
        <ul className="flex gap-6 text-sm font-bold text-foreground">
          {site.social.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="hover:text-foreground/70"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="w-full border-t border-border pt-8">
          <p className="text-base text-foreground-muted">
            Copyright © {site.owner} {year}
          </p>
        </div>
      </Container>
    </footer>
  );
}
