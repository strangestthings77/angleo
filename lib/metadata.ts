import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site-url';

export function buildMetadata({
  title,
  description,
  path = '/',
  image = '/og.jpg',
  noindex = false,
}: {
  title: string;
  description: string;
  path?: string;
  image?: string;
  /** Private pages (student area, auth) — kept out of search and the sitemap. */
  noindex?: boolean;
}): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const imageUrl = new URL(image, SITE_URL).toString();

  return {
    title,
    description,
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'pl_PL',
      siteName: 'Angleo',
      title,
      description,
      url,
      // public/og.jpg is 1200×630 (Facebook / LinkedIn don't render SVG previews).
      images: [image === '/og.jpg' ? { url: imageUrl, width: 1200, height: 630 } : imageUrl],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}
