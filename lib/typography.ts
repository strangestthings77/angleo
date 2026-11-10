const NBSP = ' ';

/**
 * Polish typesetting: a one-letter word (a, i, o, u, w, z) never ends a line, and a dash never
 * starts one. Swaps the space after/before them for a non-breaking one.
 */
export function bindShortWords(text: string): string {
  return text
    .replace(/(^|[\s(„"])([aiouwzAIOUWZ]) /g, `$1$2${NBSP}`)
    .replace(/(^|[\s(„"])([aiouwzAIOUWZ]) /g, `$1$2${NBSP}`) // "i w" — second pass for runs
    .replace(/ ([—–])/g, `${NBSP}$1`);
}
