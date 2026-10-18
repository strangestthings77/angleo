import Image from 'next/image';
import Link from 'next/link';
import { PostMeta } from '@/components/blog/PostMeta';
import { getCategory, type Post } from '@/lib/blog';

export function PostCard({ post }: { post: Post }) {
  const category = getCategory(post.category);

  return (
    <article className="group relative flex flex-col gap-5">
      <div className="overflow-hidden rounded-2xl bg-surface-muted">
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
          draggable={false}
          className="aspect-4/3 w-full object-cover transition-transform duration-500 ease-out-soft group-hover:scale-103 motion-reduce:transition-none"
        />
      </div>
      <div className="flex flex-col gap-3">
        {category && (
          <p className="text-xs font-medium tracking-eyebrow text-accent uppercase">
            {category.label}
          </p>
        )}
        <h3 className="font-serif text-title tracking-display text-foreground">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm/6 text-foreground-muted">{post.excerpt}</p>
        <PostMeta date={post.date} />
      </div>
    </article>
  );
}

export function PostGrid({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
