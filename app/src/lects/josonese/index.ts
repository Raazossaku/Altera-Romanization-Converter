import { dataLoader } from '../../data.ts';
import { segment } from '../../lexicon.ts';
import type { Lect } from '../../types.ts';
import { hangulToRoman } from './hangul.ts';

const data = dataLoader('korean.json');

export const josonese: Lect = {
  id: 'josonese',
  name: 'Josonese',
  scriptName: 'Hanmunja',
  scriptSeparator: '',
  joinRomanization: (syllables) => syllables.join(''),
  release: data.release,
  async analyze(input) {
    const { chars, phrases } = await data.load();
    return segment(input, chars, phrases).map(({ text, candidates }) => ({
      text,
      readings: candidates.map((c) => ({ ...c, romanization: hangulToRoman(c.script) })),
    }));
  },
};
