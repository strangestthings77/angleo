import { describe, expect, it } from 'vitest';
import { acceptedAnswers, checkAnswer, normalise } from '@/lib/answer-check';

describe('normalise', () => {
  it('ignores case, punctuation, spacing and Polish diacritics', () => {
    expect(normalise('  Całować  się! ')).toBe('calowac sie');
    expect(normalise('Łódź')).toBe('lodz');
  });
});

describe('acceptedAnswers', () => {
  it('splits alternatives and expands optional parts', () => {
    expect(acceptedAnswers('całować (się) / obściskiwać się').sort()).toEqual(
      ['calowac', 'calowac sie', 'obsciskiwac sie'].sort(),
    );
  });
});

describe('checkAnswer', () => {
  it.each([
    ['całować się', 'całować się', 'correct'],
    ['calowac sie', 'całować się', 'correct'],
    ['calowac si', 'całować się', 'almost'],
    ['całować', 'całować (się)', 'correct'],
    ['obściskiwać się', 'całować się / obściskiwać się', 'correct'],
    ['termin', 'termin (ostateczny)', 'correct'],
    ['termin ostateczny', 'termin (ostateczny)', 'correct'],
    ['włączyć kogoś', 'włączyć kogoś (do rozmowy, wątku)', 'correct'],
    ['zrobmy przewre', 'zróbmy przerwę', 'almost'],
    ['kod', 'kot', 'wrong'], // short words get no typo leeway
    ['spotkanie', 'całować się', 'wrong'],
    ['', 'całować się', 'wrong'],
  ])('%j for %j → %s', (typed, translation, result) => {
    expect(checkAnswer(typed, translation).result).toBe(result);
  });
});
