import { describe, expect, it } from 'vitest';
import { createLexicon, pack, segment, unpack } from './lexicon.ts';
import type { Candidate } from './types.ts';

const candidate = (script: string, percentage = 100): Candidate => ({
  script,
  rare: percentage === -1,
  percentage,
});

const chars = createLexicon(
  new Map([
    ['之', [candidate('ㄓ', 85)]],
    ['氏', [candidate('ㄕˋ', 90), candidate('ㄓ', -1)]],
    ['𠮾', [candidate('ㄫ', 0)]],
  ]),
);

const phrases = createLexicon(
  new Map([
    ['三個', [candidate('ㄙㄢ ㄍㄛˋ')]],
    ['三個月', [candidate('ㄙㄢ ㄍㄜˋ ㄩㄝ˙')]],
  ]),
);

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

describe('pack and unpack', () => {
  it('round-trip characters, including rare readings', () => {
    const back = unpack(JSON.parse(JSON.stringify(pack({ chars, phrases }))));
    expect(back.chars.entries).toEqual(chars.entries);
  });

  it('rebuild spelled words from their characters', () => {
    const lexicons = {
      chars: createLexicon(new Map([['來', [candidate('래')]], ['日', [candidate('일')]]])),
      phrases: createLexicon(new Map([['來日', [candidate('래 일')]]])),
    };
    const file = pack(lexicons);
    expect(file.spelled).toEqual(['來日']);
    const back = unpack(file);
    expect(back.phrases.entries.get('來日')).toEqual([candidate('래 일')]);
    expect(back.phrases.maxLength).toBe(2);
  });

  it('keep words whose characters have several readings', () => {
    const file = pack({ chars, phrases });
    expect(file.spelled).toEqual([]);
    expect(Object.keys(file.phrases)).toEqual(['三個', '三個月']);
  });
});
