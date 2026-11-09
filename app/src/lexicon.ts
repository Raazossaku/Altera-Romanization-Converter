import type { Candidate } from './types.ts';

export interface Lexicon {
  entries: Map<string, Candidate[]>;
  maxLength: number;
}

export interface Segment {
  text: string;
  candidates: Candidate[];
}

function rows(text: string): string[][] {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.startsWith('#'))
    .map((line) => line.split('\t').map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] !== '' && parts[1] !== '');
}

function add(entries: Map<string, Candidate[]>, key: string, candidate: Candidate): void {
  const list = entries.get(key) ?? [];
  if (!list.some((c) => c.transcription === candidate.transcription)) {
    list.push(candidate);
    entries.set(key, list);
  }
}

function lexicon(entries: Map<string, Candidate[]>): Lexicon {
  let maxLength = 0;
  for (const key of entries.keys()) {
    maxLength = Math.max(maxLength, Array.from(key).length);
  }
  return { entries, maxLength };
}

export function parseCharacters(text: string): Lexicon {
  const entries = new Map<string, Candidate[]>();
  for (const [char, transcription, stats = ''] of rows(text)) {
    const rare = stats === '#*';
    const percent = stats.endsWith('%') ? parseInt(stats, 10) : NaN;
    const percentage = rare ? -1 : Number.isNaN(percent) ? 0 : percent;
    add(entries, char!, { transcription: transcription!, rare, percentage });
  }
  for (const list of entries.values()) {
    list.sort((a, b) => b.percentage - a.percentage);
  }
  return lexicon(entries);
}

export function parsePhrases(text: string): Lexicon {
  const entries = new Map<string, Candidate[]>();
  for (const [phrase, transcription, stats = ''] of rows(text)) {
    const percent = parseInt(stats, 10);
    add(entries, phrase!, {
      transcription: transcription!,
      rare: false,
      percentage: Number.isNaN(percent) ? 100 : percent,
    });
  }
  return lexicon(entries);
}

export function segment(input: string, chars: Lexicon, phrases: Lexicon): Segment[] {
  const glyphs = Array.from(input);
  const result: Segment[] = [];
  let i = 0;
  while (i < glyphs.length) {
    const glyph = glyphs[i]!;
    if (/\s/.test(glyph)) {
      i++;
      continue;
    }
    let matched = false;
    for (let n = Math.min(phrases.maxLength, glyphs.length - i); n >= 1; n--) {
      const key = glyphs.slice(i, i + n).join('');
      const candidates = phrases.entries.get(key);
      if (candidates) {
        result.push({ text: key, candidates: [...candidates] });
        i += n;
        matched = true;
        break;
      }
    }
    if (!matched) {
      result.push({ text: glyph, candidates: [...(chars.entries.get(glyph) ?? [])] });
      i++;
    }
  }
  return result;
}
