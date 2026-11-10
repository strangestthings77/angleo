import { bindShortWords } from '@/lib/typography';

/**
 * Renders copy with `*word*` segments as the italic serif accent.
 * Lets headline strings live in `content/` without JSX. Short Polish words are kept with the next one.
 */
export function Accent({ text }: { text: string }) {
  const parts = bindShortWords(text).split(/\*([^*]+)\*/g);
  return <>{parts.map((part, i) => (i % 2 === 1 ? <em key={i}>{part}</em> : part))}</>;
}
