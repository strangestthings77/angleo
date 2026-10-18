import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { ArrowRightIcon } from '@/components/ui/Icon';
import { site } from '@/content/site';

export function Quote() {
  return (
    <section className="pb-section">
      <Container>
        <figure className="mx-auto flex max-w-4xl flex-col items-center gap-10 border-t border-border pt-20 text-center">
          <blockquote className="font-serif text-display-sm tracking-display text-balance text-foreground sm:text-display-md">
            <span className="text-accent">“</span>
            {site.quote.text}
            <span className="text-accent">”</span>
          </blockquote>
          <figcaption className="flex flex-col items-center gap-4">
            <Image
              src={site.portrait.src}
              alt=""
              width={120}
              height={120}
              draggable={false}
              className="size-14 rounded-full object-cover"
            />
            <div>
              <p className="font-medium text-foreground">{site.owner}</p>
              <p className="text-sm text-foreground-muted">{site.role}</p>
            </div>
            <Link
              href="/o-mnie"
              className="group inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent"
            >
              Poznaj mnie
              <ArrowRightIcon className="transition-transform duration-200 ease-out-soft group-hover:translate-x-0.5 motion-reduce:transition-none" />
            </Link>
          </figcaption>
        </figure>
      </Container>
    </section>
  );
}
