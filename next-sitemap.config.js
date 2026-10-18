/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://angleo.pl',
  generateRobotsTxt: true,
  // Student area + auth: private, noindex.
  exclude: ['/panel', '/panel/*', '/admin', '/admin/*', '/logowanie', '/rejestracja', '/auth/*'],
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/', disallow: ['/panel', '/admin', '/auth'] }],
  },
};
