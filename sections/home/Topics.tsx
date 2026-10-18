import Link from 'next/link';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { ArrowUpRightIcon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';
import { articles, getCategories, getPostsByCategory } from '@/lib/blog';

export function Topics() {
  return (
    <Section id="tematy" tone="muted">
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow={site.topics.eyebrow} heading={site.topics.heading} />
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {getCategories().map((category) => (
            <li key={category.slug}>
              <Link
                href={`/blog-post-categories/${category.slug}`}
                className="group flex h-full min-h-40 flex-col justify-between gap-6 rounded-2xl border border-border bg-background p-6 transition-colors duration-200 hover:border-foreground/30"
              >
                <span className="flex items-start justify-between gap-4">
                  <span className="font-serif text-title tracking-display text-foreground">
                    {category.label}
                  </span>
                  <ArrowUpRightIcon
                    size={18}
                    className="mt-1 shrink-0 text-foreground-muted transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent motion-reduce:transition-none"
                  />
                </span>
                <span className="text-sm text-foreground-muted">
                  {articles(getPostsByCategory(category.slug).length)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
