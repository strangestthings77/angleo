import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostMeta } from '@/components/blog/PostMeta';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { getCategory, type Post } from '@/lib/blog';

export function PostListItem({ post }: { post: Post }) {
  const category = getCategory(post.category);

  return (
    <article className="grid gap-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:items-center sm:gap-8">
      <Link href={`/blog/${post.slug}`} className="group overflow-hidden rounded-xl">
        <Image
          src={post.cover.src}
          alt={post.title}
          width={post.cover.width}
          height={post.cover.height}
          sizes="(min-width: 1024px) 280px, (min-width: 640px) 40vw, 100vw"
          draggable={false}
          className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
        />
      </Link>
      <div className="flex flex-col gap-3">
        {category && <CategoryBadge category={category} variant="plain" />}
        <Heading level={3} className="text-subheading sm:text-heading">
          <Link href={`/blog/${post.slug}`} className="hover:text-foreground/70">
            {post.title}
          </Link>
        </Heading>
        <Text variant="small">{post.excerpt}</Text>
        <div className="mt-2">
          <PostMeta date={post.date} />
        </div>
      </div>
    </article>
  );
}
