import Image from 'next/image';
import Link from 'next/link';
import { PostMeta } from '@/components/blog/PostMeta';
import { ArrowRightIcon } from '@/components/ui/Icon';
import { getCategory, type Post } from '@/lib/blog';

/** Wide editorial card: image left, story right. */
export function FeaturedPost({ post, priority = false }: { post: Post; priority?: boolean }) {
  const category = getCategory(post.category);

  return (
    <article className="group relative grid reveal overflow-hidden rounded-3xl bg-surface shadow-card lg:grid-cols-2">
      <div className="overflow-hidden">
        <Image
          src={post.cover.src}
          alt=""
          width={post.cover.width}
          height={post.cover.height}
          priority={priority}
          sizes="(min-width: 1024px) 600px, 100vw"
          draggable={false}
          className="aspect-4/3 size-full object-cover transition-transform duration-700 ease-out-soft group-hover:scale-102 motion-reduce:transition-none lg:aspect-auto"
        />
      </div>
      <div className="flex flex-col justify-center gap-5 p-8 sm:p-12">
        <p className="text-xs font-medium tracking-eyebrow text-accent uppercase">
          Polecany{category ? ` · ${category.label}` : ''}
        </p>
        <h2 className="font-serif text-display-sm tracking-display text-foreground sm:text-display-md">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        <p className="text-base/7 text-foreground-muted">{post.excerpt}</p>
        <PostMeta date={post.date} avatar />
        <span
          aria-hidden
          className="inline-flex items-center gap-2 pt-2 text-sm font-medium text-accent"
        >
          Czytaj artykuł
          <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
        </span>
      </div>
    </article>
  );
}
