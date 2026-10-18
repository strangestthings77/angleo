import { segments, type GapHint } from '@/lib/exercise';

/** Exercise text with a slot per gap. `renderGap` draws the input (student) or the live value (admin). */
export function ExerciseText({
  template,
  renderGap,
}: {
  template: string;
  renderGap: (index: number) => React.ReactNode;
}) {
  return (
    <div className="text-lg/10 whitespace-pre-line text-foreground">
      {segments(template).map((segment, i) =>
        segment.type === 'text' ? (
          <span key={i}>{segment.text}</span>
        ) : (
          <span key={i}>{renderGap(segment.index)}</span>
        ),
      )}
    </div>
  );
}

/** Width of a gap: enough for its letter-hint pattern in monospace. */
export const gapWidth = (hint: GapHint | undefined) =>
  `${Math.max((hint?.pattern.length ?? 6) + 1, 6)}ch`;

export type GapState = 'idle' | 'correct' | 'wrong';

export const gapClass = (state: GapState) =>
  `mx-1 inline-block w-(--gap-w) max-w-full border-b-2 bg-transparent px-1 text-center font-mono text-base leading-tight align-baseline transition-colors duration-200 placeholder:text-foreground-muted/50 focus:outline-none ${
    state === 'correct'
      ? 'border-success text-success'
      : state === 'wrong'
        ? 'border-danger text-danger'
        : 'border-foreground/30 text-foreground focus:border-accent'
  }`;
