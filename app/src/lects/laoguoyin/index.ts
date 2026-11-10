import { dataLoader } from '../../data.ts';
import { segment } from '../../lexicon.ts';
import type { Lect } from '../../types.ts';
import { joinPinyin, lgyToPinyin } from './pinyin.ts';

const loadData = dataLoader('laoguoyin.json');

export const laoguoyin: Lect = {
  id: 'laoguoyin',
  name: 'Chinese',
  detail: 'Laoguoyin',
  scriptName: 'Chuyin',
  scriptSeparator: ' ',
  hasRarity: true,
  joinRomanization: joinPinyin,
  async analyze(input) {
    const { chars, phrases } = await loadData();
    return segment(input, chars, phrases).map(({ text, candidates }) => ({
      text,
      readings: candidates.map((c) => ({ ...c, romanization: lgyToPinyin(c.script) })),
    }));
  },
};
