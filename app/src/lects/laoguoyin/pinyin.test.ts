import { describe, expect, it } from 'vitest';
import fixture from './pinyin.fixture.json';
import { lgyToPinyin } from './pinyin.ts';

describe('lgyToPinyin', () => {
  it('matches the Python lgy2py output for every syllable in the data', () => {
    const mismatches = Object.entries(fixture)
      .filter(([syllable, expected]) => lgyToPinyin(syllable) !== expected)
      .map(([syllable, expected]) => [syllable, expected, lgyToPinyin(syllable)]);
    expect(mismatches).toEqual([]);
  });

  it('converts examples', () => {
    expect(lgyToPinyin('ㄓㄨㄥ ㄍㄨㄛ˙')).toBe('zhōng guọ');
    expect(lgyToPinyin('ㄪㄟˋ')).toBe('vèi');
    expect(lgyToPinyin('ㄪㄣˊ')).toBe('vén');
    expect(lgyToPinyin('·ㄗˇ')).toBe('zi');
  });
});
