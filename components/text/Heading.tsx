type Level = 1 | 2 | 3 | 4;
const sizes: Record<Level, string> = {
  1: 'text-4xl/tight sm:text-display-1',
  2: 'text-display-4',
  3: 'text-heading',
  4: 'text-subheading',
};

export function Heading({
  level = 2,
  className,
  children,
}: {
  level?: Level;
  className?: string;
  children: React.ReactNode;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag className={`font-bold text-foreground ${sizes[level]} ${className ?? ''}`}>{children}</Tag>
  );
}
