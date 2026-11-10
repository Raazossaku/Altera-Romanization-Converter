import { describe, expect, it } from 'vitest';
import { hangulToRoman, lenite } from './hangul.ts';

describe('hangulToRoman', () => {
  it('romanizes plain syllables', () => {
    expect(hangulToRoman('녀 자')).toBe('nyeo ja');
  });

  it('applies liaison and nasalization', () => {
    expect(hangulToRoman('한 국 어')).toBe('han gu geo');
    expect(hangulToRoman('국 민')).toBe('gung min');
  });

  it('keeps ㄹ after nasal finals and nasalized ㄱ and ㅂ', () => {
    expect(hangulToRoman('독 립')).toBe('dong rip');
    expect(hangulToRoman('독 려')).toBe('dong ryeo');
    expect(hangulToRoman('정 리')).toBe('jeong ri');
    expect(hangulToRoman('강 릉')).toBe('gang reung');
    expect(hangulToRoman('심 리')).toBe('sim ri');
    expect(hangulToRoman('심 려')).toBe('sim ryeo');
    expect(hangulToRoman('감 로')).toBe('gam ro');
  });

  it('applies liquidization', () => {
    expect(hangulToRoman('신 라')).toBe('sil la');
    expect(hangulToRoman('설 날')).toBe('seol lal');
  });

  it('keeps ry- syllables like 렬, 률 and 례', () => {
    expect(hangulToRoman('대 렬')).toBe('dae ryeol');
    expect(hangulToRoman('법 률')).toBe('beom ryul');
    expect(hangulToRoman('법 례')).toBe('beom rye');
    expect(hangulToRoman('선 렬')).toBe('seol lyeol');
  });

  it('keeps ye after ㄱ, ㄹ and ㅎ', () => {
    expect(hangulToRoman('계')).toBe('gye');
    expect(hangulToRoman('례')).toBe('rye');
    expect(hangulToRoman('혜')).toBe('hye');
  });

  it('merges ㄱ, ㄷ, ㅂ, ㅈ with a following ㅎ', () => {
    expect(hangulToRoman('역 할')).toBe('yeo kal');
    expect(hangulToRoman('특 히')).toBe('teu ki');
    expect(hangulToRoman('법 학')).toBe('beo pak');
    expect(hangulToRoman('신 학')).toBe('sin hak');
  });
});

describe('lenite', () => {
  it('applies initial ㄹ and ㄴ lenition', () => {
    expect(lenite('리')).toBe('이');
    expect(lenite('래')).toBe('내');
    expect(lenite('녀')).toBe('여');
    expect(lenite('노')).toBe('노');
  });
});
