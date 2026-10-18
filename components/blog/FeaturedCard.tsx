import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { PostMeta } from '@/components/blog/PostMeta';
import { getCategory, type Post } from '@/lib/blog';

/** Image card with the title over a dark gradient (Webflow `blog-card-bg`). */
export function FeaturedCard({
  post,
  size = 'lg',
  priority = false,
}: {
  post: Post;
  size?: 'lg' | 'sm';
  priority?: boolean;
}) {
  const category = getCategory(post.category);
  const lg = size === 'lg';

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-xl ${lg ? 'min-h-110 p-6 sm:min-h-140 sm:p-10' : 'min-h-72 p-5'}`}
    >
      <Image
        src={post.cover.src}
        alt=""
        fill
        priority={priority}
        sizes={lg ? '(min-width: 1024px) 680px, 100vw' : '(min-width: 1024px) 340px, 100vw'}
        draggable={false}
        className="-z-20 object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-t from-foreground/85 via-foreground/35 to-transparent" />
      {lg && category && (
        <div className="mb-4">
          <CategoryBadge category={category} variant="white" link={false} />
        </div>
      )}
      <h2
        className={`font-bold text-background ${lg ? 'text-2xl/snug sm:text-display-4' : 'text-lg/snug'}`}
      >
        {post.title}
      </h2>
      {lg && (
        <div className="mt-5">
          <PostMeta date={post.date} inverse />
        </div>
      )}
    </Link>
  );
}
