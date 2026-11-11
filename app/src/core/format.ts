import type { Analysis, Lect, Reading } from './types.ts';

export function syllables(text: string): string[] {
  return text.split(/\s+/);
}

export function shownScript(lect: Lect, r: Reading): string {
  return syllables(r.script).join(lect.scriptSeparator);
}

export function shownRomanization(lect: Lect, r: Reading): string {
  return lect.joinRomanization(syllables(r.romanization));
}

export function copyText(
  results: Analysis[],
  layer: 'script' | 'romanization',
  lect: Lect,
): string {
  return results
    .map(({ text, readings }) => {
      const top = readings[0];
      if (!top) return text;
      return layer === 'script' ? shownScript(lect, top) : shownRomanization(lect, top);
    })
    .join(' ');
}

export interface Unit {
  char: string;
  script: string;
  romanization: string;
  title: string;
}

export function units(results: Analysis[]): Unit[] {
  return results.flatMap(({ text, readings }) => {
    const chars = Array.from(text);
    const top = readings[0];
    const title = readings.map((r) => `${r.script} (${r.romanization})`).join('\n');
    const scripts = top ? syllables(top.script) : [];
    const romanizations = top ? syllables(top.romanization) : [];
    return chars.map((char, i) => {
      if (!top) return { char, script: '', romanization: '', title };
      if (chars.length === 1) {
        return { char, script: top.script, romanization: top.romanization, title };
      }
      if (scripts.length === chars.length) {
        return {
          char,
          script: scripts[i] ?? '',
          romanization: romanizations[i] ?? '',
          title,
        };
      }
      return { char, script: '', romanization: '', title };
    });
  });
}
