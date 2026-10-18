/**
 * Renders copy with `*word*` segments as the italic serif accent.
 * Lets headline strings live in `content/` without JSX.
 */
export function Accent({ text }: { text: string }) {
  const parts = text.split(/\*([^*]+)\*/g);
  return <>{parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}</>;
}
