import Link from 'next/link';
import { SectionHeader } from '@/components/marketing/SectionHeader';
import { Container } from '@/components/ui/Container';
import { BriefcaseIcon, ChartIcon, ChatIcon } from '@/components/ui/Icon';
import { Section } from '@/components/ui/Section';
import { site } from '@/content/site';
import { getCategory } from '@/lib/blog';

const icons = { briefcase: BriefcaseIcon, chat: ChatIcon, chart: ChartIcon };

export function Audiences() {
  const { audiences } = site;

  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-16">
        <SectionHeader eyebrow={audiences.eyebrow} heading={audiences.heading} />
        <ul className="grid gap-4 md:grid-cols-3">
          {audiences.items.map((item) => {
            const Icon = icons[item.icon as keyof typeof icons];
            return (
              <li
                key={item.title}
                className="flex flex-col gap-8 rounded-3xl border border-border bg-background p-8"
              >
                <span className="flex size-12 items-center justify-center rounded-full border border-border text-accent">
                  <Icon size={20} />
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="font-serif text-title tracking-display text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm/6 text-foreground-muted">{item.body}</p>
                </div>
                <ul className="mt-auto flex flex-wrap gap-2">
                  {item.categories.map((slug) => {
                    const category = getCategory(slug);
                    if (!category) return null;
                    return (
                      <li key={slug}>
                        <Link
                          href={`/blog-post-categories/${slug}`}
                          className="inline-flex h-8 items-center rounded-full bg-surface-muted px-3 text-xs text-foreground transition-colors duration-200 hover:bg-foreground hover:text-background"
                        >
                          {category.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
