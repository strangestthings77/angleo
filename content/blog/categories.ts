import type { Category } from '@/lib/blog';

/** Order matches the category bar on angleo.pl. Slugs match the old Webflow URLs. */
export const categories: Category[] = [
  { slug: 'hr', label: 'HR' },
  { slug: 'finanse', label: 'Finanse' },
  { slug: 'spotkanie-biznesowe', label: 'Spotkanie biznesowe' },
  { slug: 'podroz-sluzbowa', label: 'Podróż służbowa' },
  { slug: 'project-management', label: 'Project management' },
  { slug: 'marketing', label: 'Marketing' },
  { slug: 'logistyka-2', label: 'Logistyka' },
  { slug: 'rozmowa-o-prace', label: 'Rozmowa o pracę' },
];
