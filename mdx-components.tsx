import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

/** Article typography for MDX posts. */
function Figure({
  src,
  width,
  height,
  alt = '',
}: {
  src: string;
  width: number;
  height: number;
  alt?: string;
}) {
  return (
    <figure className="my-12">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 768px) 680px, 100vw"
        draggable={false}
        className="w-full rounded-2xl"
      />
    </figure>
  );
}

const components: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-16 mb-6 font-serif text-display-sm tracking-display text-foreground first:mt-0"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-12 mb-4 text-xl/8 font-semibold tracking-tight text-foreground first:mt-0"
      {...props}
    />
  ),
  h4: (props) => <h4 className="mt-10 mb-3 text-lg/7 font-semibold text-foreground" {...props} />,
  h5: (props) => <h5 className="mt-8 mb-2 text-base/7 font-semibold text-foreground" {...props} />,
  p: (props) => <p className="mb-6 text-prose text-foreground/80" {...props} />,
  ul: (props) => (
    <ul
      className="mb-8 flex list-disc flex-col gap-3 pl-6 text-prose text-foreground/80 marker:text-accent"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-8 flex list-decimal flex-col gap-3 pl-6 text-prose text-foreground/80 marker:font-medium marker:text-accent"
      {...props}
    />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  em: (props) => <em className="text-foreground" {...props} />,
  strong: (props) => <strong className="font-semibold text-foreground" {...props} />,
  a: (props) => (
    <a
      className="text-foreground underline decoration-accent underline-offset-4 hover:text-accent"
      {...props}
    />
  ),
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
