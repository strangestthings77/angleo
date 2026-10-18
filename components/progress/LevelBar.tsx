import { LESSONS_PER_LEVEL, type Progress } from '@/lib/progress';

/** Segmented bar: one segment per lesson in the current level. */
export function LevelBar({ progress, size = 'md' }: { progress: Progress; size?: 'sm' | 'md' }) {
  const { level, inLevel } = progress;
  return (
    <div
      role="progressbar"
      aria-label={`Poziom ${level}: ${inLevel} z ${LESSONS_PER_LEVEL} lekcji`}
      aria-valuemin={0}
      aria-valuemax={LESSONS_PER_LEVEL}
      aria-valuenow={inLevel}
      className={`grid grid-cols-10 ${size === 'sm' ? 'gap-0.5' : 'gap-1.5'}`}
    >
      {Array.from({ length: LESSONS_PER_LEVEL }, (_, i) => (
        <span
          key={i}
          className={`overflow-hidden rounded-full bg-surface-muted ${size === 'sm' ? 'h-1.5' : 'h-2.5'}`}
        >
          <span
            className={`block size-full origin-left rounded-full bg-accent transition-transform duration-500 ease-out-soft motion-reduce:transition-none ${
              i < inLevel ? 'scale-x-100' : 'scale-x-0'
            }`}
          />
        </span>
      ))}
    </div>
  );
}
