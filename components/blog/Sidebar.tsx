import Image from 'next/image';
import Link from 'next/link';
import { CategoryTags } from '@/components/blog/CategoryTags';
import { FeaturedCard } from '@/components/blog/FeaturedCard';
import { Heading } from '@/components/text/Heading';
import { Text } from '@/components/text/Text';
import { site } from '@/content/site';
import { AUTHOR, getPopularPosts } from '@/lib/blog';

export function Sidebar({ activeCategory }: { activeCategory?: string }) {
  const [top, ...rest] = getPopularPosts();

  return (
    <aside className="flex flex-col gap-10">
      <Link href="/o-mnie" className="group flex flex-col items-center gap-4 text-center">
        <Image
          src={site.portrait.src}
          alt={site.portrait.alt}
          width={site.portrait.width}
          height={site.portrait.height}
          sizes="(min-width: 1024px) 340px, 100vw"
          draggable={false}
          className="aspect-4/3 w-full rounded-xl object-cover"
        />
        <Heading level={3} className="group-hover:text-foreground/70">
          {AUTHOR}
        </Heading>
        <div className="flex flex-col gap-4">
          {site.authorBio.map((line) => (
            <Text key={line} variant="small">
              {line}
            </Text>
          ))}
        </div>
      </Link>

      <hr className="border-border" />

      <CategoryTags active={activeCategory} />

      {top && <FeaturedCard post={top} size="sm" />}

      <ul className="flex flex-col gap-5">
        {rest.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="group flex items-center gap-4">
              <Image
                src={post.cover.src}
                alt=""
                width={post.cover.width}
                height={post.cover.height}
                sizes="96px"
                draggable={false}
                className="aspect-4/3 w-24 shrink-0 rounded-lg object-cover"
              />
              <span className="text-sm/5 font-bold text-foreground group-hover:text-foreground/70">
                {post.title}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
