'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui/Icon';

type Item = { label: string; href: string };

/** Disclosure menu for small screens; closes on navigation and Escape. */
export function MobileMenu({ items, cta }: { items: readonly Item[]; cta: Item }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Zamknij menu' : 'Otwórz menu'}
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 inline-flex size-11 items-center justify-center rounded-full text-foreground"
      >
        {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
      </button>
      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-background"
      >
        <nav aria-label="Menu" className="flex flex-col px-container py-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex min-h-12 items-center border-b border-border font-serif text-title text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={cta.href}
            onClick={() => setOpen(false)}
            className="mt-6 mb-2 inline-flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
          >
            {cta.label}
          </Link>
        </nav>
      </div>
    </div>
  );
}
