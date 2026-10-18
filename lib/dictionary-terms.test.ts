import { describe, expect, it } from 'vitest';
import { normaliseTerm, splitGloss } from '@/lib/dictionary-terms';

describe('normaliseTerm', () => {
  it.each([
    ['To make out', 'make out'],
    ['to loop someone in', 'loop in'],
    ['Break sth down', 'break down'],
    ['deadline', 'deadline'],
  ])('%j → %j', (input, key) => expect(normaliseTerm(input)).toBe(key));
});

describe('splitGloss', () => {
  it('splits options and keeps parenthesised commas', () => {
    expect(splitGloss('pieścić się, całować, obejmować')).toEqual([
      'pieścić się',
      'całować',
      'obejmować',
    ]);
    expect(splitGloss('prąd (morski, rzeki, powietrza, itp.)')).toEqual([
      'prąd (morski, rzeki, powietrza, itp.)',
    ]);
  });

  it('drops qualifiers and "itp."', () => {
    expect(splitGloss('o wodzie: bieżąca')).toEqual(['bieżąca']);
    expect(splitGloss('wypisać, wystawić czek itp.')).toEqual(['wypisać', 'wystawić czek']);
  });
});
