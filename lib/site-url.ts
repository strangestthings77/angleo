/** The public domain. angleo.pl redirects here (Vercel), so canonicals must use www. */
export const PRODUCTION_URL = 'https://www.angleo.pl';

/**
 * Origin for canonicals, Open Graph and structured data. Production is hard-wired to the real
 * domain: the Vercel env vars once pointed at angleo.vercel.app, which made Google treat that
 * as the main site. Preview deployments use their own URL; dev uses localhost.
 */
export const SITE_URL =
  process.env.NODE_ENV !== 'production'
    ? 'http://localhost:3000'
    : process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : PRODUCTION_URL;
