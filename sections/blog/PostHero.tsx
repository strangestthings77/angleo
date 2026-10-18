import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostMeta } from '@/components/blog/PostMeta';
import { Heading } from '@/components/text/Heading';
import { Container } from '@/components/ui/Container';
import { getCategory, type Post } from '@/lib/blog';

/** Grey band with badge, title and author/date (Webflow `blog-post-hero`). */
export function PostHero({ post }: { post: Post }) {
  const category = getCategory(post.category);

  return (
    <section className="bg-surface pt-24 pb-16 sm:pt-40 sm:pb-25">
      <Container>
        <div className="flex max-w-prose-narrow flex-col">
          {category && (
            <div className="mb-6">
              <CategoryBadge category={category} variant="white" />
            </div>
          )}
          <Heading level={1} className="mb-8">
            {post.title}
          </Heading>
          <PostMeta date={post.date} size="lg" />
        </div>
      </Container>
    </section>
  );
}
