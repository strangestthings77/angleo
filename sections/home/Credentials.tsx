import { Container } from '@/components/ui/Container';
import { site } from '@/content/site';
import { articles, getCategories, getPosts } from '@/lib/blog';

export function Credentials() {
  const facts = [
    ...site.credentials,
    {
      title: articles(getPosts().length),
      detail: `${getCategories().length} tematów biznesowych na blogu`,
    },
  ];

  return (
    <section className="border-y border-border">
      <Container>
        <dl className="grid divide-border sm:grid-cols-3 sm:divide-x">
          {facts.map((fact) => (
            <div
              key={fact.title}
              className="flex flex-col gap-1 border-b border-border py-8 last:border-b-0 sm:border-b-0 sm:px-8 sm:first:pl-0"
            >
              <dt className="font-serif text-title tracking-display text-foreground">
                {fact.title}
              </dt>
              <dd className="text-sm text-foreground-muted">{fact.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
