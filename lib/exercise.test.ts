import { describe, expect, it } from 'vitest';
import { isGapCorrect, parseExercise, patternFor, segments, toSource } from '@/lib/exercise';

describe('patternFor', () => {
  it('reveals one letter like the printed exercise', () => {
    expect(patternFor('enquiry', 2)).toBe('_ _ q _ _ _ _');
    expect(patternFor('fee', null)).toBe('_ _ _');
    expect(patternFor('take off', 5)).toBe('_ _ _ _   o _ _');
  });
});

describe('parseExercise', () => {
  const { template, hints, answers } = parseExercise(
    'Thank you for your [[enquiry/inquiry|q]] about the [[workshop|h]]. Please [[attend|3]].',
  );

  it('replaces gaps with numbered placeholders', () => {
    expect(template).toBe('Thank you for your {{0}} about the {{1}}. Please {{2}}.');
  });

  it('builds hints from letters and positions', () => {
    expect(hints.map((h) => h.pattern)).toEqual([
      '_ _ q _ _ _ _',
      '_ _ _ _ _ h _ _',
      '_ _ t _ _ _', // "|3" → 3rd letter, not the first "t"
    ]);
  });

  it('keeps every accepted answer', () => {
    expect(answers).toEqual([['enquiry', 'inquiry'], ['workshop'], ['attend']]);
  });

  it('splits the template into text and gaps', () => {
    expect(segments(template).filter((s) => s.type === 'gap')).toHaveLength(3);
  });
});

describe('isGapCorrect', () => {
  it('ignores case and surrounding punctuation, not spelling', () => {
    expect(isGapCorrect(' Enquiry ', ['enquiry', 'inquiry'])).toBe(true);
    expect(isGapCorrect('inquiry.', ['enquiry', 'inquiry'])).toBe(true);
    expect(isGapCorrect('enqiury', ['enquiry'])).toBe(false);
    expect(isGapCorrect('', ['enquiry'])).toBe(false);
  });
});

describe('toSource', () => {
  it('round-trips through parseExercise', () => {
    const source =
      'Your [[enquiry/inquiry|q]] about the [[workshop|h]].\nPlease [[attend|3]], the [[fee]] and [[take off|o]].';
    expect(toSource(parseExercise(source))).toBe(source);
  });

  it('writes a repeated letter as its position', () => {
    // "|t" would mean the first t; the hint reveals the second one.
    expect(toSource(parseExercise('[[attend|3]]'))).toBe('[[attend|3]]');
    expect(toSource(parseExercise('[[attend|2]]'))).toBe('[[attend|t]]');
  });
});
