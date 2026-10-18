import Link from 'next/link';

/** The cyan pill CTA from the Webflow site. Internal hrefs use `next/link`. */
export function Button({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const classes = `inline-flex items-center justify-center rounded-full bg-accent px-5.5 py-3 text-base/5 font-bold tracking-label text-accent-foreground transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${className ?? ''}`;

  if (href.startsWith('/')) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={classes}>
      {children}
    </a>
  );
}
