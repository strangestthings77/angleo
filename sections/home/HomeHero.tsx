import Link from 'next/link';
import { FeaturedCard } from '@/components/blog/FeaturedCard';
import { Container } from '@/components/ui/Container';
import { getCategory, getFeaturedPosts } from '@/lib/blog';

export function HomeHero() {
  const [main, ...headlines] = getFeaturedPosts();
  if (!main) return null;

  return (
    <section className="pt-12 sm:pt-16">
      <Container className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <FeaturedCard post={main} priority />
        <ul className="flex flex-col divide-y divide-border">
          {headlines.map((post) => (
            <li key={post.slug} className="py-6 first:pt-0 last:pb-0">
              <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-3">
                <span className="text-sm font-bold tracking-label text-foreground-muted uppercase">
                  {getCategory(post.category)?.label}
                </span>
                <h3 className="text-heading font-bold text-foreground group-hover:text-foreground/70">
                  {post.title}
                </h3>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
