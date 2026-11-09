import { segment } from '../../lexicon.ts';
import type { Lect } from '../../types.ts';
import { loadData } from './data.ts';
import { lgyToPinyin } from './pinyin.ts';

export const laoguoyin: Lect = {
  id: 'laoguoyin-pinyin',
  name: 'Chinese (Laoguoyin)',
  async analyze(input) {
    const { chars, phrases } = await loadData();
    return segment(input, chars, phrases).map(({ text, candidates }) => ({
      text,
      readings: candidates.map((c) => ({ ...c, converted: lgyToPinyin(c.transcription) })),
    }));
  },
};
