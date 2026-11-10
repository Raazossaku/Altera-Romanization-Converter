import { describe, expect, it } from 'vitest';
import { pack, unpack } from '../../lexicon.ts';
import { buildLaoguoyin, parseCharacters, parsePhrases } from './build.ts';

const chars = parseCharacters(
  [
    '# comment',
    '之\tㄓ\t85%\t\t#note',
    '之\tㄓ\t85%',
    '氏\tㄓ\t#*',
    '氏\tㄕˋ\t90%',
    '𠮾\tㄫ\t0%',
    '',
  ].join('\n'),
);

const phrases = parsePhrases(
  ['三個\tㄙㄢ ㄍㄛˋ\t100%', '三個月\tㄙㄢ ㄍㄜˋ ㄩㄝ˙', '三\tㄙㄢ\t40%'].join('\n'),
);

describe('parseCharacters', () => {
  it('skips comments, drops duplicate readings and sorts by percentage', () => {
    expect(chars.entries.get('之')).toEqual([{ script: 'ㄓ', rare: false, percentage: 85 }]);
    expect(chars.entries.get('氏')?.map((c) => c.script)).toEqual(['ㄕˋ', 'ㄓ']);
  });

  it('marks #* readings as rare', () => {
    expect(chars.entries.get('氏')?.[1]).toEqual({ script: 'ㄓ', rare: true, percentage: -1 });
  });
});

describe('parsePhrases', () => {
  it('defaults a missing percentage to 100', () => {
    expect(phrases.entries.get('三個月')?.[0]?.percentage).toBe(100);
  });

  it('records the longest phrase length', () => {
    expect(phrases.maxLength).toBe(3);
  });
});

describe('Laoguoyin files', () => {
  const lexicons = buildLaoguoyin(
    '一\tㄧ\n十\tㄕ\n行\tㄒㄧㄥˊ\n行\tㄏㄤˊ\n',
    '一十\tㄧ ㄕ\n一行\tㄧ ㄒㄧㄥˊ\n',
  );

  it('keep only words the characters do not already spell out', () => {
    const file = pack(lexicons);
    expect(file.spelled).toEqual(['一十']);
    expect(Object.keys(file.phrases)).toEqual(['一行']);
  });

  it('round-trip through pack and unpack', () => {
    const back = unpack(JSON.parse(JSON.stringify(pack(lexicons))));
    expect(back.phrases.entries).toEqual(lexicons.phrases.entries);
    expect(back.chars.entries).toEqual(lexicons.chars.entries);
    expect(back.phrases.maxLength).toBe(lexicons.phrases.maxLength);
  });
});
