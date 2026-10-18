/**
 * Lookup key for English terms, shared by the import script and the app:
 * lowercase, single spaces, no leading "to ", no placeholder objects —
 * so "To loop someone in" and "loop in" meet at the same key.
 */
export function normaliseTerm(term: string): string {
  return term
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/\b(someone|somebody|something|sb|sth|one's|oneself)\b/g, ' ')
    .replace(/^to\s+/, '')
    .replace(/[^a-z0-9' -]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Splits a Wiktionary gloss into individual Polish options:
 * "pieścić się, całować, obejmować" → ["pieścić się", "całować", "obejmować"].
 * Commas inside parentheses are kept; "o wodzie: bieżąca" → "bieżąca"; trailing "itp." dropped.
 */
export function splitGloss(gloss: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let current = '';
  for (const ch of gloss) {
    if (ch === '(') depth++;
    if (ch === ')') depth = Math.max(0, depth - 1);
    if ((ch === ',' || ch === ';') && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);
  return parts
    .map((p) =>
      p
        .replace(/^[^:()]{1,25}:\s*/, '')
        .replace(/\s+itp\.?$/, '')
        .trim(),
    )
    .filter((p) => p.length > 0 && p.length <= 60);
}

/** Credit line required by the CC BY-SA licence of the dictionary data. */
export const DICTIONARY_CREDIT = 'Słownik: Wikisłownik (CC BY-SA 4.0)';
export const DICTIONARY_CREDIT_URL = 'https://pl.wiktionary.org/';
