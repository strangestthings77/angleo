import { site } from '@/content/site';
import { AUTHOR, getCategory, type Post } from '@/lib/blog';
import { SITE_URL } from '@/lib/site-url';

/**
 * schema.org graphs for Google. Only facts the site already states — no prices, ratings or
 * reviews (Google penalises invented ones). Validate: https://search.google.com/test/rich-results
 */

const url = (path = '/') => new URL(path, SITE_URL).toString();
const ORG_ID = url('/#organization');
const PERSON_ID = url('/#nicole-kurek');
const WEBSITE_ID = url('/#website');

const sameAs = site.social.map((s) => s.href);

/** On every page: the business, Nicole, and the site itself. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['EducationalOrganization', 'ProfessionalService'],
        '@id': ORG_ID,
        name: site.name,
        alternateName: `${site.name} – angielski biznesowy online`,
        url: url(),
        description: site.description,
        image: url('/og.jpg'),
        email: site.contact.email,
        telephone: site.contact.phone,
        address: {
          '@type': 'PostalAddress',
          streetAddress: site.company.street,
          postalCode: site.company.city.split(' ')[0],
          addressLocality: site.company.city.split(' ').slice(1).join(' '),
          addressCountry: 'PL',
        },
        areaServed: { '@type': 'Country', name: 'Polska' },
        knowsLanguage: ['pl', 'en'],
        founder: { '@id': PERSON_ID },
        sameAs,
        makesOffer: {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Lekcje angielskiego biznesowego online 1:1',
            serviceType: 'Lekcje języka angielskiego',
            description:
              'Indywidualne lekcje angielskiego biznesowego online przez Google Meet: e-maile, prezentacje, spotkania, negocjacje i rozmowy o pracę.',
            provider: { '@id': ORG_ID },
            areaServed: { '@type': 'Country', name: 'Polska' },
            availableChannel: { '@type': 'ServiceChannel', serviceUrl: url('/umow-lekcje') },
          },
        },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: site.owner,
        url: url('/o-mnie'),
        image: url(site.portrait.src),
        jobTitle: 'Trenerka języka angielskiego biznesowego',
        worksFor: { '@id': ORG_ID },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Uniwersytet Śląski' },
        knowsAbout: ['angielski biznesowy', 'Business English', 'język angielski', 'tłumaczenia'],
        knowsLanguage: ['pl', 'en'],
        sameAs,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        name: site.name,
        url: url(),
        inLanguage: 'pl-PL',
        publisher: { '@id': ORG_ID },
      },
    ],
  };
}

/** The FAQ section as FAQPage — pass the items exactly as rendered. */
export function faqGraph(items: readonly { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

/** /o-mnie: a profile page about Nicole. */
export function profileGraph() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: url('/o-mnie'),
    mainEntity: { '@id': PERSON_ID },
    isPartOf: { '@id': WEBSITE_ID },
  };
}

/** Blog post: the article plus its breadcrumb trail. */
export function postGraph(post: Post) {
  const postUrl = url(`/blog/${post.slug}`);
  const category = getCategory(post.category);
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        url: postUrl,
        mainEntityOfPage: postUrl,
        image: url(post.cover.src),
        datePublished: post.date,
        dateModified: post.date,
        inLanguage: 'pl-PL',
        ...(category ? { articleSection: category.label } : {}),
        author: { '@id': PERSON_ID, name: AUTHOR },
        publisher: { '@id': ORG_ID },
        isPartOf: { '@id': WEBSITE_ID },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Strona główna', item: url('/') },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: url('/blog') },
          { '@type': 'ListItem', position: 3, name: post.title, item: postUrl },
        ],
      },
    ],
  };
}
