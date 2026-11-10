import { describe, expect, it } from 'vitest';
import { units } from './render.ts';
import type { Analysis } from './types.ts';

const reading = (transcription: string, converted: string) => ({
  transcription,
  converted,
  rare: false,
  percentage: 100,
});

describe('units', () => {
  it('splits a phrase reading across its characters', () => {
    const results: Analysis[] = [
      { text: '震旦', readings: [reading('ㄓㄣˋ ㄉㄢˋ', 'zhèn dàn')] },
    ];
    expect(units(results).map((u) => [u.char, u.zhuyin, u.romanized])).toEqual([
      ['震', 'ㄓㄣˋ', 'zhèn'],
      ['旦', 'ㄉㄢˋ', 'dàn'],
    ]);
  });

  it('puts a whole reading over a single character', () => {
    const results: Analysis[] = [{ text: '鿗', readings: [reading('ㄧ ㄧ ㄙㄨ ㄙㄧ', 'yī yī sū sī')] }];
    expect(units(results)[0]).toMatchObject({ zhuyin: 'ㄧ ㄧ ㄙㄨ ㄙㄧ', romanized: 'yī yī sū sī' });
  });

  it('leaves characters without readings unannotated', () => {
    const results: Analysis[] = [{ text: 'a', readings: [] }];
    expect(units(results)).toEqual([{ char: 'a', zhuyin: '', romanized: '', title: '' }]);
  });

  it('keeps characters outside the basic plane whole', () => {
    const results: Analysis[] = [{ text: '𠮾', readings: [reading('·ㄫ', 'ngi')] }];
    expect(units(results)).toHaveLength(1);
  });
});
