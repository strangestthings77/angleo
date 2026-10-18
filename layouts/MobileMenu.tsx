'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CloseIcon, MenuIcon } from '@/components/ui/Icon';

type Item = { label: string; href: string };

/**
 * Disclosure menu for small screens; closes on link click and Escape.
 * No usePathname(): it would force a Suspense boundary on every dynamic route.
 */
export function MobileMenu({ items, cta }: { items: readonly Item[]; cta: Item }) {
  const [open, setOpen] = useState(false);

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
        <span key={open ? 'close' : 'menu'} className="animate-fade">
          {open ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
        </span>
      </button>
      <div
        id="mobile-menu"
        inert={!open}
        aria-hidden={!open}
        className={`absolute inset-x-0 top-full border-b border-border bg-background shadow-card transition-[opacity,translate] duration-250 ease-out-soft motion-reduce:transition-none ${
          open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-2 opacity-0'
        }`}
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
