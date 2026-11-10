import { describe, expect, it } from 'vitest';
import fixture from './pinyin.fixture.json';
import { joinPinyin, lgyToPinyin } from './pinyin.ts';

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

describe('joinPinyin', () => {
  it('joins syllables without a separator', () => {
    expect(joinPinyin(['zhōng', 'guó'])).toBe('zhōngguó');
    expect(joinPinyin(['yī', 'yī'])).toBe('yīyī');
  });

  it('marks syllables that start with a vowel', () => {
    expect(joinPinyin(['xī', 'ān'])).toBe("xī'ān");
    expect(joinPinyin(['pí', 'ào'])).toBe("pí'ào");
    expect(joinPinyin(['fā', 'ë̌'])).toBe("fā'ë̌");
  });

  it('separates n from a following g or j', () => {
    expect(joinPinyin(['xiān', 'gē'])).toBe("xiān'gē");
    expect(joinPinyin(['rén', 'jiān'])).toBe("rén'jiān");
    expect(joinPinyin(['zhōng', 'gē'])).toBe('zhōnggē');
  });

  it('leaves ng and nj initials unmarked after a vowel', () => {
    expect(joinPinyin(['bā', 'ngī'])).toBe('bāngī');
    expect(joinPinyin(['xī', 'njī'])).toBe('xīnjī');
  });
});

describe('joinPinyin case', () => {
  it('marks boundaries in title case and capitals', () => {
    expect(joinPinyin(['Xī', 'ān'])).toBe("Xī'ān");
    expect(joinPinyin(['XIĀN', 'GĒ'])).toBe("XIĀN'GĒ");
  });
});
