/**
 * Gap-fill exercise format, shared by the admin editor, the student player and the live view.
 *
 *   Thank you for your [[enquiry|q]] concerning the [[workshop|h]] …
 *
 *   [[answer]]            gap; the hint shows one "_" per letter
 *   [[answer|q]]          reveal letter "q" (its first occurrence)
 *   [[answer|3]]          reveal the 3rd letter (for letters that repeat: attend → _ _ t _ _ _)
 *   [[enquiry/inquiry]]   several accepted answers (the hint follows the first one)
 *
 * The parsed result splits into a public part (template + hints, safe for the student) and the
 * answers (kept server-side / in the database until the student submits).
 */

export type GapHint = {
  /** Letters in the (first) answer, spaces kept as gaps between words. */
  pattern: string;
  length: number;
};

export type ParsedExercise = {
  /** Text with {{0}}, {{1}}, … where the gaps go. */
  template: string;
  hints: GapHint[];
  /** Accepted answers per gap. */
  answers: string[][];
};

const GAP = /\[\[([^\]]+)\]\]/g;

/** "enquiry", reveal 3 → "_ _ q _ _ _ _"; words in multi-word answers are 3 spaces apart. */
export function patternFor(answer: string, reveal: number | null): string {
  let index = 0;
  return answer
    .split(' ')
    .map((word) => {
      const letters = [...word].map((ch) => (index++ === reveal ? ch : '_'));
      index++; // the space between words
      return letters.join(' ');
    })
    .join('   ');
}

function revealIndex(answer: string, spec: string | undefined): number | null {
  if (!spec) return null;
  const trimmed = spec.trim();
  if (/^\d+$/.test(trimmed)) {
    const i = Number(trimmed) - 1;
    return i >= 0 && i < answer.length ? i : null;
  }
  const i = answer.toLowerCase().indexOf(trimmed.toLowerCase());
  return i >= 0 ? i : null;
}

export function parseExercise(content: string): ParsedExercise {
  const hints: GapHint[] = [];
  const answers: string[][] = [];
  const template = content.replace(GAP, (_, inner: string) => {
    const [answerPart, spec] = inner.split('|');
    const accepted = answerPart
      .split('/')
      .map((a) => a.trim())
      .filter(Boolean);
    const first = accepted[0] ?? '';
    hints.push({ pattern: patternFor(first, revealIndex(first, spec)), length: first.length });
    answers.push(accepted);
    return `{{${answers.length - 1}}}`;
  });
  return { template, hints, answers };
}

/** Template → text and gap tokens, for rendering. */
export type Segment = { type: 'text'; text: string } | { type: 'gap'; index: number };

export function segments(template: string): Segment[] {
  const out: Segment[] = [];
  let last = 0;
  for (const m of template.matchAll(/\{\{(\d+)\}\}/g)) {
    if (m.index > last) out.push({ type: 'text', text: template.slice(last, m.index) });
    out.push({ type: 'gap', index: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < template.length) out.push({ type: 'text', text: template.slice(last) });
  return out;
}

/** Same normalisation the database uses when grading (keep in sync with grade_exercise()). */
export function normaliseGap(value: string): string {
  return value
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, ' ')
    .replace(/^[\s.,;:!?"'„”]+|[\s.,;:!?"'„”]+$/g, '');
}

export function isGapCorrect(typed: string, accepted: readonly string[]): boolean {
  const value = normaliseGap(typed);
  return value.length > 0 && accepted.some((a) => normaliseGap(a) === value);
}

/** Student answers, keyed by gap index. */
export type Answers = Record<string, string>;
