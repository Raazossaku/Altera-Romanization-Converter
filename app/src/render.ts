import type { Analysis, Reading } from './types.ts';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className = '',
  text = '',
  children: Node[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  node.textContent = text;
  node.append(...children);
  return node;
}

function tier(r: Reading): string {
  if (r.rare) return 'rare';
  if (r.percentage === 0) return 'zero';
  if (r.percentage > 85) return 'p85';
  if (r.percentage > 70) return 'p70';
  if (r.percentage > 50) return 'p50';
  if (r.percentage > 25) return 'p25';
  if (r.percentage > 10) return 'p10';
  return 'p1';
}

function reading(r: Reading): HTMLElement {
  const syllables = r.transcription
    .split(/\s+/)
    .flatMap((s, i) => [...(i > 0 ? [document.createTextNode(' ')] : []), el('span', 'syllable', s)]);
  return el('li', `reading ${tier(r)}`, '', [
    el('span', 'transcription', '', syllables),
    el('span', 'converted', r.converted),
  ]);
}

function card(analysis: Analysis): HTMLElement {
  const body =
    analysis.readings.length > 0
      ? el('ul', 'readings', '', analysis.readings.map(reading))
      : el('p', 'empty', 'No data');
  return el('div', 'card', '', [el('div', 'glyph', analysis.text), body]);
}

export function renderCards(results: Analysis[]): HTMLElement {
  return el('div', 'cards', '', results.map(card));
}

export function renderMessage(text: string, className = ''): HTMLElement {
  return el('p', `message ${className}`, text);
}
