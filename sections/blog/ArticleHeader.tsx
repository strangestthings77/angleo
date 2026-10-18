import Image from 'next/image';
import Link from 'next/link';
import { PostMeta } from '@/components/blog/PostMeta';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { getCategory, type Post } from '@/lib/blog';

export function ArticleHeader({ post }: { post: Post }) {
  const category = getCategory(post.category);

  return (
    <header className="pt-12 md:pt-20">
      <Container className="flex flex-col items-center gap-8 text-center">
        <nav aria-label="Ścieżka" className="text-xs font-medium tracking-eyebrow uppercase">
          <ol className="flex items-center gap-3 text-foreground-muted">
            <li>
              <Link href="/blog" className="hover:text-foreground">
                Blog
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden>/</li>
                <li>
                  <Link
                    href={`/blog-post-categories/${category.slug}`}
                    className="text-accent hover:text-foreground"
                  >
                    {category.label}
                  </Link>
                </li>
              </>
            )}
          </ol>
        </nav>
        <Heading as="h1" size="lg" className="max-w-4xl">
          {post.title}
        </Heading>
        <p className="max-w-2xl text-lead text-foreground-muted">{post.excerpt}</p>
        <PostMeta date={post.date} avatar />
      </Container>
      <Container className="mt-14 md:mt-20">
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          priority
          sizes="(min-width: 1232px) 1168px, 100vw"
          draggable={false}
          className="aspect-video w-full rounded-3xl object-cover"
        />
      </Container>
    </header>
  );
}
