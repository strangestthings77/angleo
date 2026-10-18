type Tone = 'default' | 'muted';
const tones: Record<Tone, string> = {
  default: '',
  muted: 'bg-surface-muted',
};

export function Section({
  children,
  tone = 'default',
  className,
  id,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`scroll-mt-20 py-section ${tones[tone]} ${className ?? ''}`}>
      {children}
    </section>
  );
}
