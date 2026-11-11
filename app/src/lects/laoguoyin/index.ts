import { dataLoader } from '../../core/data.ts';
import { segment } from '../../core/lexicon.ts';
import type { Lect } from '../../core/types.ts';
import { joinPinyin, lgyToPinyin } from './pinyin.ts';

const data = dataLoader('laoguoyin.json');

export const laoguoyin: Lect = {
  id: 'laoguoyin',
  name: 'Chinese',
  detail: 'Laoguoyin',
  scriptName: 'Chuyin',
  scriptSeparator: ' ',
  hasRarity: true,
  joinRomanization: joinPinyin,
  release: data.release,
  async analyze(input) {
    const { chars, phrases } = await data.load();
    return segment(input, chars, phrases).map(({ text, candidates }) => ({
      text,
      readings: candidates.map((c) => ({ ...c, romanization: lgyToPinyin(c.script) })),
    }));
  },
};
