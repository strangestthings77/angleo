type Level = 1 | 2 | 3 | 4;
const sizes: Record<Level, string> = {
  1: 'text-4xl font-semibold sm:text-6xl',
  2: 'text-3xl font-semibold sm:text-4xl',
  3: 'text-xl font-semibold',
  4: 'text-lg font-semibold',
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
    <Tag className={`font-display tracking-tight ${sizes[level]} ${className ?? ''}`}>
      {children}
    </Tag>
  );
}
