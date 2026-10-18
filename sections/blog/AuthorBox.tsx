import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';

export function AuthorBox() {
  return (
    <aside className="flex flex-col gap-6 rounded-3xl bg-surface-muted p-8 sm:flex-row sm:items-center">
      <Image
        src={site.portrait.src}
        alt={site.portrait.alt}
        width={200}
        height={200}
        draggable={false}
        className="size-20 shrink-0 rounded-full object-cover"
      />
      <div className="flex flex-col gap-2">
        <p className="text-xs font-medium tracking-eyebrow text-accent uppercase">Autorka</p>
        <p className="font-serif text-title tracking-display text-foreground">{site.owner}</p>
        <p className="text-sm/6 text-foreground-muted">{site.authorBio}</p>
        <Link
          href="/o-mnie"
          className="mt-1 text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent"
        >
          Więcej o mnie
        </Link>
      </div>
    </aside>
  );
}
