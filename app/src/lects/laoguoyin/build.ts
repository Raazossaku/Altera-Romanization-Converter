import { createLexicon, RARE, type Lexicon, type Lexicons } from '../../core/lexicon.ts';
import type { Candidate } from '../../core/types.ts';

function rows(text: string): string[][] {
  return text
    .split('\n')
    .filter((line) => line.trim() !== '' && !line.startsWith('#'))
    .map((line) => line.split('\t').map((part) => part.trim()))
    .filter((parts) => parts.length >= 2 && parts[0] !== '' && parts[1] !== '');
}

function add(entries: Map<string, Candidate[]>, key: string, candidate: Candidate): void {
  const list = entries.get(key) ?? [];
  if (!list.some((c) => c.script === candidate.script)) {
    list.push(candidate);
    entries.set(key, list);
  }
}

export function parseCharacters(text: string): Lexicon {
  const entries = new Map<string, Candidate[]>();
  for (const [char, script, stats = ''] of rows(text)) {
    const rare = stats === '#*';
    const percent = stats.endsWith('%') ? parseInt(stats, 10) : NaN;
    const percentage = rare ? RARE : Number.isNaN(percent) ? 0 : percent;
    add(entries, char!, { script: script!, rare, percentage });
  }
  for (const list of entries.values()) {
    list.sort((a, b) => b.percentage - a.percentage);
  }
  return createLexicon(entries);
}

export function parsePhrases(text: string): Lexicon {
  const entries = new Map<string, Candidate[]>();
  for (const [phrase, script, stats = ''] of rows(text)) {
    const percent = parseInt(stats, 10);
    add(entries, phrase!, {
      script: script!,
      rare: false,
      percentage: Number.isNaN(percent) ? 100 : percent,
    });
  }
  return createLexicon(entries);
}

export function buildLaoguoyin(charsText: string, phrasesText: string): Lexicons {
  return { chars: parseCharacters(charsText), phrases: parsePhrases(phrasesText) };
}
