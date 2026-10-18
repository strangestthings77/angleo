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

describe('checkAnswer with dictionary alternatives', () => {
  const makeOut = ['zrozumieć', 'zorientować się w czymś', 'pieścić się', 'całować', 'obejmować'];

  it('reports another real meaning as "other"', () => {
    const verdict = checkAnswer('zrozumiec', 'całować się', makeOut);
    expect(verdict.result).toBe('other');
    expect(verdict.result === 'other' && verdict.matched).toBe('zrozumieć');
  });

  it('prefers the lesson meaning over alternatives', () => {
    expect(checkAnswer('całować się', 'całować się', makeOut).result).toBe('correct');
  });

  it('still rejects unrelated answers', () => {
    expect(checkAnswer('spotkanie', 'całować się', makeOut).result).toBe('wrong');
  });
});
