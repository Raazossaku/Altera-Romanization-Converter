import { describe, expect, it } from 'vitest';
import { deserialize, parseCharacters, parsePhrases, segment, serialize } from './lexicon.ts';

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

const phrases = parsePhrases(['三個\tㄙㄢ ㄍㄛˋ\t100%', '三個月\tㄙㄢ ㄍㄜˋ ㄩㄝ˙', '三\tㄙㄢ\t40%'].join('\n'));

describe('parseCharacters', () => {
  it('skips comments, drops duplicate readings and sorts by percentage', () => {
    expect(chars.entries.get('之')).toEqual([{ transcription: 'ㄓ', rare: false, percentage: 85 }]);
    expect(chars.entries.get('氏')?.map((c) => c.transcription)).toEqual(['ㄕˋ', 'ㄓ']);
  });

  it('marks #* readings as rare', () => {
    expect(chars.entries.get('氏')?.[1]).toEqual({ transcription: 'ㄓ', rare: true, percentage: -1 });
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

describe('serialize and deserialize', () => {
  it('round-trips characters, including rare readings', () => {
    const copy = deserialize(JSON.parse(JSON.stringify(serialize(chars))));
    expect(copy.entries).toEqual(chars.entries);
  });

  it('round-trips phrases and keeps the longest length', () => {
    const copy = deserialize(JSON.parse(JSON.stringify(serialize(phrases))));
    expect(copy.entries).toEqual(phrases.entries);
    expect(copy.maxLength).toBe(phrases.maxLength);
  });
});

describe('segment', () => {
  it('prefers the longest phrase', () => {
    expect(segment('三個月', chars, phrases).map((s) => s.text)).toEqual(['三個月']);
  });

  it('falls back to single characters and skips whitespace', () => {
    expect(segment('之 氏', chars, phrases).map((s) => s.text)).toEqual(['之', '氏']);
  });

  it('keeps characters outside the basic plane whole', () => {
    expect(segment('𠮾', chars, phrases)[0]?.text).toBe('𠮾');
  });

  it('returns no candidates for unknown characters', () => {
    expect(segment('x', chars, phrases)[0]?.candidates).toEqual([]);
  });
});
