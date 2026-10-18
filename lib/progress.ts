/** Lesson → level rule. Every LESSONS_PER_LEVEL completed lessons is a new level. */
export const LESSONS_PER_LEVEL = 10;
export const MAX_LESSONS = 1000;

export type Progress = {
  lessons: number;
  level: number;
  /** Lessons done inside the current level, 0–9. */
  inLevel: number;
  /** Lessons left until the next level, 1–10. */
  toNext: number;
};

export function progressFor(lessons: number): Progress {
  const safe = Math.max(0, Math.min(MAX_LESSONS, Math.floor(lessons)));
  const inLevel = safe % LESSONS_PER_LEVEL;
  return {
    lessons: safe,
    level: Math.floor(safe / LESSONS_PER_LEVEL) + 1,
    inLevel,
    toNext: LESSONS_PER_LEVEL - inLevel,
  };
}
