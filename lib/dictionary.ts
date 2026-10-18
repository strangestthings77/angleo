import 'server-only';
import { normaliseTerm, splitGloss } from '@/lib/dictionary-terms';
import { createClient } from '@/lib/supabase/server';

/** Server-side reads of public.dictionary (EN→PL senses, Polish Wiktionary). */

export type Sense = { pos: string | null; gloss: string; options: string[] };

const POS_PL: Record<string, string> = {
  noun: 'rzeczownik',
  verb: 'czasownik',
  adj: 'przymiotnik',
  adv: 'przysłówek',
  phrase: 'wyrażenie',
  prep: 'przyimek',
};

export const posLabel = (pos: string | null) => (pos ? (POS_PL[pos] ?? pos) : null);

/** Every sense for an English term, e.g. "to make out" → 6 meanings. */
export async function lookupTerm(term: string): Promise<Sense[]> {
  const key = normaliseTerm(term);
  if (!key) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('dictionary')
    .select('pos, gloss')
    .eq('term_norm', key)
    .order('id')
    .limit(20);
  return (data ?? []).map((s) => ({ pos: s.pos, gloss: s.gloss, options: splitGloss(s.gloss) }));
}

/** Other valid Polish meanings for many terms at once (for the word test). */
export async function alternativesFor(terms: string[]): Promise<Map<string, string[]>> {
  const keys = [...new Set(terms.map(normaliseTerm).filter(Boolean))];
  const result = new Map<string, string[]>();
  if (keys.length === 0) return result;
  const supabase = await createClient();
  const { data } = await supabase
    .from('dictionary')
    .select('term_norm, gloss')
    .in('term_norm', keys)
    .limit(2000);
  for (const row of data ?? []) {
    const list = result.get(row.term_norm) ?? [];
    list.push(...splitGloss(row.gloss));
    result.set(row.term_norm, list);
  }
  return result;
}
