import { el } from './dom.ts';
import type { Settings } from './options.ts';
import type { Analysis, Lect, Reading } from './types.ts';

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

function syllables(text: string): string[] {
  return text.split(/\s+/);
}

function shownScript(lect: Lect, r: Reading): string {
  return syllables(r.script).join(lect.scriptSeparator);
}

function shownRomanization(lect: Lect, r: Reading): string {
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

function reading(r: Reading, lect: Lect): HTMLElement {
  const parts = syllables(r.script).flatMap((syllable, i) => [
    ...(i > 0 && lect.scriptSeparator ? [document.createTextNode(lect.scriptSeparator)] : []),
    el('span', 'syllable', syllable),
  ]);
  return el('li', `reading ${tier(r)}`, '', [
    el('span', 'script', '', parts),
    el('span', 'romanization', shownRomanization(lect, r)),
  ]);
}

function card(analysis: Analysis, lect: Lect): HTMLElement {
  const body =
    analysis.readings.length > 0
      ? el('ul', 'readings', '', analysis.readings.map((r) => reading(r, lect)))
      : el('p', 'empty', 'No data');
  return el('div', 'card', '', [el('div', 'glyph', analysis.text), body]);
}

interface Unit {
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

function unit(u: Unit): HTMLElement {
  const node = el('div', 'unit', '', [
    el('span', 'script', u.script),
    el('span', 'romanization', u.romanization),
    el('span', 'hanzi', u.char),
  ]);
  node.title = u.title;
  return node;
}

function paged<T>(
  items: T[],
  make: (item: T) => HTMLElement,
  className: string,
  size: number,
): HTMLElement {
  const list = el('div', className);
  const more = el('button', 'more');
  more.type = 'button';
  let shown = 0;

  function showMore(): void {
    list.append(...items.slice(shown, shown + size).map(make));
    shown = Math.min(shown + size, items.length);
    more.textContent = `Show more (${items.length - shown} left)`;
    more.hidden = shown >= items.length;
  }

  more.addEventListener('click', showMore);
  showMore();
  return el('div', '', '', [list, more]);
}

const LAYERS = ['script', 'romanization', 'hanzi'];

function renderRuby(results: Analysis[]): HTMLElement {
  const view = paged(units(results), unit, 'ruby', 300);
  const list = view.querySelector<HTMLElement>('.ruby')!;
  list.addEventListener('pointerdown', (event) => {
    const target = event.target as Element;
    const layer = LAYERS.find((name) => target.closest(`.${name}`));
    if (layer) list.dataset.layer = layer;
    else delete list.dataset.layer;
  });
  list.addEventListener('copy', (event) => {
    const layer = list.dataset.layer;
    const selection = getSelection();
    if (!layer || !selection || selection.isCollapsed) return;
    const text = [...list.querySelectorAll(`.unit .${layer}`)]
      .filter((node) => selection.containsNode(node, true))
      .map((node) => node.textContent ?? '')
      .join(layer === 'hanzi' ? '' : ' ');
    event.clipboardData?.setData('text/plain', text);
    event.preventDefault();
  });
  return view;
}

export function renderResults(results: Analysis[], settings: Settings, lect: Lect): HTMLElement {
  const view =
    settings.view === 'ruby'
      ? renderRuby(results)
      : paged(results, (analysis) => card(analysis, lect), 'cards', 100);
  view.dataset.script = settings.showScript ? 'on' : 'off';
  return view;
}

export function renderMessage(text: string, className = ''): HTMLElement {
  return el('p', `message ${className}`, text);
}
