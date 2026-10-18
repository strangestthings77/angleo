import { PostListItem } from '@/components/blog/PostListItem';
import { Sidebar } from '@/components/blog/Sidebar';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import type { Post } from '@/lib/blog';

/** Post list + sidebar (Webflow `main-posts`). */
export function PostFeed({ posts, activeCategory }: { posts: Post[]; activeCategory?: string }) {
  return (
    <Section>
      <Container className="grid gap-14 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-16">
        <div className="flex flex-col gap-12">
          {posts.map((post) => (
            <PostListItem key={post.slug} post={post} />
          ))}
        </div>
        <Sidebar activeCategory={activeCategory} />
      </Container>
    </Section>
  );
}
