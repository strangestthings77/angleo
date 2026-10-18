import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';

// Cached so the year is fixed at build time — `cacheComponents` rejects a bare `new Date()`.
async function currentYear() {
  'use cache';
  return new Date().getFullYear();
}

export async function Footer() {
  const year = await currentYear();

  return (
    <footer className="border-border bg-surface border-t">
      <Container className="text-foreground-muted flex flex-col gap-6 py-10 text-sm sm:flex-row sm:items-end sm:justify-between">
        <address className="not-italic">
          <p className="text-foreground font-medium">
            {site.owner} – {site.role}
          </p>
          <p>{site.company.street}</p>
          <p>{site.company.city}</p>
          <p>NIP: {site.company.nip}</p>
        </address>
        <div className="flex flex-col gap-3 sm:items-end">
          <ul className="flex gap-4">
            {site.social.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <p>
            Copyright © {site.owner} {year}
          </p>
        </div>
      </Container>
    </footer>
  );
}
