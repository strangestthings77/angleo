import Image from 'next/image';
import { site } from '@/content/site';
import { AUTHOR, formatDate } from '@/lib/blog';

export function PostMeta({ date, avatar = false }: { date: string; avatar?: boolean }) {
  return (
    <div className="flex items-center gap-3 text-sm text-foreground-muted">
      {avatar && (
        <Image
          src={site.portrait.src}
          alt=""
          width={80}
          height={80}
          draggable={false}
          className="size-9 rounded-full object-cover"
        />
      )}
      {avatar && <span className="font-medium text-foreground">{AUTHOR}</span>}
      {avatar && <span aria-hidden>·</span>}
      <time dateTime={date}>{formatDate(date)}</time>
    </div>
  );
}
