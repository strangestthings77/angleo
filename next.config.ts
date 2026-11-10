import createMDX from '@next/mdx';
import type { NextConfig } from 'next';

/**
 * Blog posts that kept English Webflow-template slugs until 2026-11 → their Polish slugs.
 * The old URLs (and cover image paths) redirect permanently so links and rankings carry over.
 */
const renamedPosts: Record<string, string> = {
  '10-productivity-tools-that-are-worth-checking-out': 'small-talk-po-angielsku',
  '3-tips-to-avoid-internet-distractions-at-work': 'marketing-po-angielsku',
  '7-great-productivity-apps-for-your-new-ipad': 'angielski-dla-project-managera',
  'a-complete-guide-to-learn-project-management': 'angielski-dla-bankowcow-prezentacje',
  'how-time-tracking-can-improve-team-management': 'delegacja-po-angielsku',
  'how-to-choose-the-best-management-software': 'przeprosiny-za-opoznienie-w-logistyce',
  'how-to-create-an-organized-productivity-plan-for-the-year':
    'slownictwo-korporacyjne-po-angielsku',
};

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    qualities: [75, 90, 100],
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  // The Vercel alias serves the same site; send it (and its ranking signals) to the real domain.
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'angleo.vercel.app' }],
        destination: 'https://www.angleo.pl/:path*',
        permanent: true,
      },
      ...Object.entries(renamedPosts).flatMap(([from, to]) => [
        { source: `/blog/${from}`, destination: `/blog/${to}`, permanent: true },
        {
          source: `/images/blog/${from}.jpg`,
          destination: `/images/blog/${to}.jpg`,
          permanent: true,
        },
      ]),
    ];
  },
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
