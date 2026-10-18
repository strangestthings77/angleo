/**
 * Forgiving answer check for the word test (EN → PL).
 *
 * The admin's translation is the source of truth, written with two conventions:
 *   "całować się / obściskiwać się"  → either alternative is accepted ("/" or ";")
 *   "całować (się)"                  → text in parentheses is optional
 *
 * A typed answer is compared after normalising case, spacing, punctuation and Polish
 * diacritics, so "calowac sie" matches "całować się". Small typos still count, as "almost".
 */

export type Verdict =
  | { result: 'correct'; expected: string }
  | { result: 'almost'; expected: string }
  | { result: 'wrong'; expected: string };

const DIACRITICS: Record<string, string> = {
  ą: 'a',
  ć: 'c',
  ę: 'e',
  ł: 'l', // ł doesn't decompose under NFD, so it needs mapping
  ń: 'n',
  ó: 'o',
  ś: 's',
  ź: 'z',
  ż: 'z',
};

export function normalise(text: string): string {
  return text
    .toLowerCase()
    .replace(/[ąćęłńóśźż]/g, (c) => DIACRITICS[c] ?? c)
    .normalize('NFD')
    .replace(/\p{M}/gu, '') // any other accents
    .replace(/[^\p{L}\p{N}\s]/gu, ' ') // punctuation → space
    .replace(/\s+/g, ' ')
    .trim();
}

/** Every acceptable answer: split alternatives, then expand optional "(…)" parts. */
export function acceptedAnswers(translation: string): string[] {
  const variants = new Set<string>();
  for (const alternative of translation.split(/[/;]/)) {
    const optional = [...alternative.matchAll(/\(([^)]*)\)/g)];
    // Each "(…)" can be in or out: 2^n combinations (n is tiny in practice; capped at 4).
    const count = Math.min(optional.length, 4);
    for (let mask = 0; mask < 1 << count; mask++) {
      let i = 0;
      const text = alternative.replace(/\(([^)]*)\)/g, (_, inner: string) =>
        i < count && mask & (1 << i++) ? ` ${inner} ` : ' ',
      );
      const clean = normalise(text);
      if (clean) variants.add(clean);
    }
  }
  return [...variants];
}

/** Damerau–Levenshtein (optimal string alignment): insert, delete, substitute, swap. */
export function editDistance(a: string, b: string): number {
  const d = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)),
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }
  return d[a.length][b.length];
}

/** Typos allowed for an answer of this length — none for short words ("kot" ≠ "kod"). */
function tolerance(length: number): number {
  if (length <= 4) return 0;
  if (length <= 9) return 1;
  return 2;
}

export function checkAnswer(typed: string, translation: string): Verdict {
  const expected = translation.trim();
  const answer = normalise(typed);
  if (!answer) return { result: 'wrong', expected };

  const accepted = acceptedAnswers(translation);
  if (accepted.includes(answer)) return { result: 'correct', expected };

  const close = accepted.some((a) => editDistance(answer, a) <= tolerance(a.length));
  return { result: close ? 'almost' : 'wrong', expected };
}
