import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { getCategories } from '@/lib/blog';

// Cached so the year is fixed at build time — `cacheComponents` rejects a bare `new Date()`.
async function currentYear() {
  'use cache';
  return new Date().getFullYear();
}

const heading = 'mb-5 text-xs font-medium tracking-eyebrow text-accent-light uppercase';
const link = 'text-inverse-muted transition-colors duration-200 hover:text-background';

export async function Footer() {
  const year = await currentYear();
  const { company, contact } = site;

  return (
    <footer className="bg-foreground text-background">
      <Container className="grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <div className="flex flex-col gap-5">
          <Link href="/" className="font-serif text-4xl tracking-display">
            {site.name}
          </Link>
          <p className="max-w-xs text-sm/6 text-inverse-muted">
            Angielski w pracy i biznesie z {site.owner}. Praktyczne frazy, wskazówki i lekcje dla
            profesjonalistów.
          </p>
        </div>
        <div>
          <p className={heading}>Strona</p>
          <ul className="flex flex-col gap-3 text-sm">
            {[...site.nav, site.cta].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={link}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={heading}>Tematy</p>
          <ul className="flex flex-col gap-3 text-sm">
            {getCategories().map((category) => (
              <li key={category.slug}>
                <Link href={`/blog-post-categories/${category.slug}`} className={link}>
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className={heading}>Kontakt</p>
          <ul className="flex flex-col gap-3 text-sm">
            <li>
              <a href={`mailto:${contact.email}`} className={link}>
                {contact.email}
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className={link}>
                {contact.phone}
              </a>
            </li>
            {site.social.map((item) => (
              <li key={item.href}>
                <a href={item.href} target="_blank" rel="noreferrer" className={link}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-t border-background/10">
        <Container className="flex flex-col gap-2 py-8 text-xs/5 text-inverse-muted sm:flex-row sm:justify-between">
          <address className="not-italic">
            {site.owner} – {site.role} · {company.street}, {company.city} · NIP: {company.nip}
          </address>
          <p>
            © {year} {site.owner}
          </p>
        </Container>
      </div>
    </footer>
  );
}
