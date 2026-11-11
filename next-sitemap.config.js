// Keep in sync with lib/site-url.ts — production is always the real (www) domain.
const siteUrl =
  process.env.VERCEL_ENV === 'preview' && process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'https://www.angleo.pl';
const isPreview = process.env.VERCEL_ENV === 'preview';

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  exclude: [
    // Student area + auth: private, noindex.
    '/panel',
    '/panel/*',
    '/admin',
    '/admin/*',
    '/logowanie',
    '/rejestracja',
    '/auth/*',
  ],
  robotsTxtOptions: {
    // Previews must never be indexed; production hides only the private areas.
    policies: isPreview
      ? [{ userAgent: '*', disallow: '/' }]
      : [{ userAgent: '*', allow: '/', disallow: ['/panel', '/admin', '/auth'] }],
  },
};
