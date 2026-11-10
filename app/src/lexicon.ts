import type { Candidate } from './types.ts';

export const RARE = -1;

export interface Lexicon {
  entries: Map<string, Candidate[]>;
  maxLength: number;
}

export interface Lexicons {
  chars: Lexicon;
  phrases: Lexicon;
}

interface Segment {
  text: string;
  candidates: Candidate[];
}

type LexiconJson = Record<string, [string, number][]>;

export interface LexiconFile {
  chars: LexiconJson;
  phrases: LexiconJson;
  spelled: string[];
}

export function createLexicon(entries: Map<string, Candidate[]>): Lexicon {
  let maxLength = 0;
  for (const key of entries.keys()) {
    maxLength = Math.max(maxLength, Array.from(key).length);
  }
  return { entries, maxLength };
}

function serialize(source: Map<string, Candidate[]>): LexiconJson {
  const out: LexiconJson = {};
  for (const [key, candidates] of source) {
    out[key] = candidates.map((c) => [c.script, c.percentage]);
  }
  return out;
}

function deserialize(data: LexiconJson): Map<string, Candidate[]> {
  const entries = new Map<string, Candidate[]>();
  for (const [key, candidates] of Object.entries(data)) {
    entries.set(
      key,
      candidates.map(([script, percentage]) => ({
        script,
        rare: percentage === RARE,
        percentage,
      })),
    );
  }
  return entries;
}

function spelledReading(key: string, chars: Lexicon): string | undefined {
  const readings = Array.from(key).map((char) => chars.entries.get(char));
  if (readings.some((candidates) => candidates?.length !== 1)) return undefined;
  return readings.map((candidates) => candidates![0]!.script).join(' ');
}

export function pack({ chars, phrases }: Lexicons): LexiconFile {
  const kept = new Map<string, Candidate[]>();
  const spelled: string[] = [];
  for (const [key, candidates] of phrases.entries) {
    const only = candidates[0]!;
    const redundant =
      candidates.length === 1 &&
      only.percentage === 100 &&
      spelledReading(key, chars) === only.script;
    if (redundant) spelled.push(key);
    else kept.set(key, candidates);
  }
  return { chars: serialize(chars.entries), phrases: serialize(kept), spelled };
}

export function unpack(file: LexiconFile): Lexicons {
  const chars = createLexicon(deserialize(file.chars));
  const phrases = deserialize(file.phrases);
  for (const key of file.spelled) {
    const script = spelledReading(key, chars);
    if (script !== undefined) phrases.set(key, [{ script, rare: false, percentage: 100 }]);
  }
  return { chars, phrases: createLexicon(phrases) };
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
