import { createLexicon, type Lexicons } from '../../lexicon.ts';
import type { Candidate } from '../../types.ts';
import { dropFinal, hasSaiSiot, lenite } from './hangul.ts';

const HAN = /^\p{Script=Han}+$/u;
const HANGUL = /^[가-힣]+$/;

interface Row {
  hangul: string[];
  hanja: string[];
}

function parseRows(text: string): Row[] {
  const rows: Row[] = [];
  for (const line of text.split('\n')) {
    if (line.startsWith('#')) continue;
    const [hangul = '', hanja = ''] = line.split(':');
    if (!HANGUL.test(hangul) || !HAN.test(hanja)) continue;
    const syllables = Array.from(hangul);
    const glyphs = Array.from(hanja);
    if (syllables.length === glyphs.length) rows.push({ hangul: syllables, hanja: glyphs });
  }
  return rows;
}

function conservative(readings: Set<string>): string[] {
  const all = [...readings];
  return all.filter((r) => !all.some((other) => other !== r && lenite(other) === r));
}

function conservativeOf(syllable: string, readings: Set<string>): string | undefined {
  const all = [...readings];
  const lenited = all.find((r) => r !== syllable && lenite(r) === syllable);
  if (lenited) return lenited;
  const dropped = all.map(dropFinal);
  return dropped.find((r, i) => r !== all[i] && r !== syllable && lenite(r) === syllable);
}

function restore(syllable: string, readings: Set<string> | undefined): string {
  if (!readings) return syllable;
  if (readings.has(syllable)) return conservativeOf(syllable, readings) ?? syllable;
  const bare = hasSaiSiot(syllable) ? dropFinal(syllable) : syllable;
  return conservativeOf(bare, readings) ?? bare;
}

function candidate(script: string): Candidate {
  return { script, rare: false, percentage: 100 };
}

export function buildJosonese(hanjaText: string): Lexicons {
  const rows = parseRows(hanjaText);

  const readings = new Map<string, Set<string>>();
  for (const { hangul, hanja } of rows) {
    if (hanja.length !== 1) continue;
    const set = readings.get(hanja[0]!) ?? new Set<string>();
    set.add(hangul[0]!);
    readings.set(hanja[0]!, set);
  }

  const chars = new Map<string, Candidate[]>();
  for (const [char, set] of readings) {
    chars.set(char, conservative(set).map(candidate));
  }

  const found = new Map<string, Set<string>>();
  for (const { hangul, hanja } of rows) {
    if (hanja.length < 2) continue;
    const restored = hanja.map((char, i) => restore(hangul[i]!, readings.get(char)));
    const key = hanja.join('');
    const set = found.get(key) ?? new Set<string>();
    set.add(restored.join(' '));
    found.set(key, set);
  }
  const phrases = new Map<string, Candidate[]>();
  for (const [key, set] of found) {
    phrases.set(key, [...set].map(candidate));
  }

  return { chars: createLexicon(chars), phrases: createLexicon(phrases) };
}
