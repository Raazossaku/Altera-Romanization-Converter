import { describe, expect, it } from 'vitest';
import { copyText, units } from './render.ts';
import type { Analysis, Lect } from './types.ts';

const reading = (script: string, romanization: string) => ({
  script,
  romanization,
  rare: false,
  percentage: 100,
});

describe('units', () => {
  it('splits a phrase reading across its characters', () => {
    const results: Analysis[] = [
      { text: '震旦', readings: [reading('ㄓㄣˋ ㄉㄢˋ', 'zhèn dàn')] },
    ];
    expect(units(results).map((u) => [u.char, u.script, u.romanization])).toEqual([
      ['震', 'ㄓㄣˋ', 'zhèn'],
      ['旦', 'ㄉㄢˋ', 'dàn'],
    ]);
  });

  it('puts a whole reading over a single character', () => {
    const whole = reading('ㄧ ㄧ ㄙㄨ ㄙㄧ', 'yī yī sū sī');
    const results: Analysis[] = [{ text: '鿗', readings: [whole] }];
    expect(units(results)[0]).toMatchObject({
      script: 'ㄧ ㄧ ㄙㄨ ㄙㄧ',
      romanization: 'yī yī sū sī',
    });
  });

  it('leaves characters without readings unannotated', () => {
    const results: Analysis[] = [{ text: 'a', readings: [] }];
    expect(units(results)).toEqual([{ char: 'a', script: '', romanization: '', title: '' }]);
  });

  it('keeps characters outside the basic plane whole', () => {
    const results: Analysis[] = [{ text: '𠮾', readings: [reading('·ㄫ', 'ngi')] }];
    expect(units(results)).toHaveLength(1);
  });
});

const lect = (scriptSeparator: string, join: string): Lect => ({
  id: 'x',
  name: 'X',
  scriptName: 'Script',
  scriptSeparator,
  joinRomanization: (syllables) => syllables.join(join),
  analyze: async () => [],
  release: () => {},
});

describe('copyText', () => {
  const results: Analysis[] = [
    { text: '震旦', readings: [reading('ㄓㄣˋ ㄉㄢˋ', 'zhèn dàn')] },
    { text: 'x', readings: [] },
  ];

  it('joins the top reading of each word with the lect separators', () => {
    expect(copyText(results, 'romanization', lect(' ', ''))).toBe('zhèndàn x');
    expect(copyText(results, 'script', lect(' ', ''))).toBe('ㄓㄣˋ ㄉㄢˋ x');
    expect(copyText(results, 'script', lect('', ''))).toBe('ㄓㄣˋㄉㄢˋ x');
  });
});
