type Size = 'xl' | 'lg' | 'md' | 'sm';
const sizes: Record<Size, string> = {
  xl: 'text-display-md sm:text-display-lg lg:text-display-xl',
  lg: 'text-display-sm sm:text-display-md lg:text-display-lg',
  md: 'text-display-sm sm:text-display-md',
  sm: 'text-title sm:text-display-sm',
};

/** Serif display heading. `<em>` inside renders as the brass italic accent. */
export function Heading({
  as: Tag = 'h2',
  size = 'md',
  inverse = false,
  className,
  children,
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p';
  size?: Size;
  inverse?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const tone = inverse
    ? 'text-background [&_em]:text-accent-light'
    : 'text-foreground [&_em]:text-accent';
  return (
    <Tag
      className={`font-serif font-normal tracking-display [&_em]:italic ${tone} ${sizes[size]} ${className ?? ''}`}
    >
      {children}
    </Tag>
  );
}
