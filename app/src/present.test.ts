import { describe, expect, it } from 'vitest';
import { defaults } from './options.ts';
import { applyCase, present } from './present.ts';
import type { Analysis, Lect } from './types.ts';

const lect = (hasRarity: boolean): Lect => ({
  id: 'x',
  name: 'X',
  scriptName: 'Chuyin',
  scriptSeparator: ' ',
  hasRarity,
  joinRomanization: (syllables) => syllables.join(''),
  analyze: async () => [],
  release: () => {},
});

const reading = (romanization: string, rare: boolean) => ({
  script: '',
  romanization,
  rare,
  percentage: rare ? -1 : 100,
});

const results: Analysis[] = [
  { text: 'a', readings: [reading('xī ān', false), reading('xī án', true)] },
  { text: 'b', readings: [reading('wū', true)] },
];

describe('applyCase', () => {
  it('changes letter case', () => {
    expect(applyCase('xī ān', 'lower')).toBe('xī ān');
    expect(applyCase('xī ān', 'title')).toBe('Xī ān');
    expect(applyCase('xī ān', 'caps')).toBe('XĪ ĀN');
  });
});

describe('present', () => {
  it('hides rare readings but keeps a character whose readings are all rare', () => {
    const out = present(results, { ...defaults, showRare: false }, lect(true));
    expect(out[0]!.readings.map((r) => r.romanization)).toEqual(['xī ān']);
    expect(out[1]!.readings).toHaveLength(1);
  });

  it('ignores the rare setting for lects without rarity data', () => {
    const out = present(results, { ...defaults, showRare: false }, lect(false));
    expect(out[0]!.readings).toHaveLength(2);
  });
});
