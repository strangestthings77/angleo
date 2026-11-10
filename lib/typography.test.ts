import { describe, expect, it } from 'vitest';
import { bindShortWords } from '@/lib/typography';

const NBSP = ' ';

describe('bindShortWords', () => {
  it('keeps one-letter words with the next word', () => {
    expect(bindShortWords('Angielski w pracy i biznesie')).toBe(
      `Angielski w${NBSP}pracy i${NBSP}biznesie`,
    );
  });

  it('handles runs of short words and sentence starts', () => {
    expect(bindShortWords('I w domu, a z pracy')).toBe(
      `I${NBSP}w${NBSP}domu, a${NBSP}z${NBSP}pracy`,
    );
  });

  it('keeps a dash on the line before', () => {
    expect(bindShortWords('biznesie — z łatwością')).toBe(`biznesie${NBSP}— z${NBSP}łatwością`);
  });

  it('leaves longer words alone', () => {
    expect(bindShortWords('od e-maili po negocjacje')).toBe('od e-maili po negocjacje');
  });
});
