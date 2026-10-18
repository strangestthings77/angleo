import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';

/** Webflow `rich-text` styles, mapped onto MDX elements. */
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
    <figure className="my-10">
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes="(min-width: 1024px) 760px, 100vw"
        draggable={false}
        className="w-full rounded-xl"
      />
    </figure>
  );
}

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 text-display-4 font-bold text-foreground" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 text-subheading font-bold text-foreground" {...props} />,
  h4: (props) => <h4 className="mt-8 mb-3 text-xl/8 font-bold text-foreground" {...props} />,
  h5: (props) => <h5 className="mt-6 mb-2 text-lg/7 font-bold text-foreground" {...props} />,
  p: (props) => <p className="mb-4 text-base/7 text-foreground-muted" {...props} />,
  ul: (props) => (
    <ul className="mb-6 list-disc pl-10 text-base/7 text-foreground-muted" {...props} />
  ),
  ol: (props) => (
    <ol className="mb-6 list-decimal pl-10 text-base/7 text-foreground-muted" {...props} />
  ),
  li: (props) => <li className="mb-2" {...props} />,
  strong: (props) => <strong className="font-bold text-foreground" {...props} />,
  a: (props) => <a className="text-foreground underline underline-offset-4" {...props} />,
  Figure,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
