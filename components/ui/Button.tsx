import Link from 'next/link';
import { ArrowRightIcon } from '@/components/ui/Icon';

type Variant = 'primary' | 'secondary' | 'light';
const variants: Record<Variant, string> = {
  primary: 'bg-foreground text-background hover:bg-foreground/85',
  secondary: 'border border-foreground/20 text-foreground hover:border-foreground/60',
  light: 'bg-background text-foreground hover:bg-surface',
};

/** Pill button. Internal hrefs use `next/link`; external open in a new tab. */
export function Button({
  href,
  variant = 'primary',
  arrow = false,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = `group inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium transition-[background-color,border-color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent ${variants[variant]} ${className ?? ''}`;
  const content = (
    <>
      {children}
      {arrow && (
        <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
      )}
    </>
  );

  if (href.startsWith('/') || href.startsWith('#')) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  const external = href.startsWith('http');
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      className={classes}
    >
      {content}
    </a>
  );
}
