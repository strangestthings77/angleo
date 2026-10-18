import Image from 'next/image';
import { ClockIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';
import { AUTHOR, formatDate } from '@/lib/blog';

/** Avatar + author + date row. `inverse` is for text over images. */
export function PostMeta({
  date,
  inverse = false,
  size = 'sm',
}: {
  date: string;
  inverse?: boolean;
  size?: 'sm' | 'lg';
}) {
  const text = `${size === 'lg' ? 'text-base sm:text-lg' : 'text-sm'} font-bold ${inverse ? 'text-background' : 'text-foreground'}`;
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <div className="flex items-center gap-2">
        <Image
          src={site.portrait.src}
          alt=""
          width={64}
          height={64}
          draggable={false}
          className={`${size === 'lg' ? 'size-8' : 'size-6'} rounded-full object-cover`}
        />
        <span className={text}>{AUTHOR}</span>
      </div>
      <div className="flex items-center gap-2">
        <ClockIcon className={inverse ? 'text-background' : 'text-foreground'} />
        <time dateTime={date} className={text}>
          {formatDate(date)}
        </time>
      </div>
    </div>
  );
}
