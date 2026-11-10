import { options, type Settings } from './options.ts';
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

export interface Unit {
  char: string;
  zhuyin: string;
  romanized: string;
  title: string;
}

export function units(results: Analysis[]): Unit[] {
  return results.flatMap(({ text, readings }) => {
    const chars = Array.from(text);
    const top = readings[0];
    const title = readings.map((r) => `${r.transcription} (${r.converted})`).join('\n');
    const zhuyin = top?.transcription.split(/\s+/) ?? [];
    const romanized = top?.converted.split(/\s+/) ?? [];
    return chars.map((char, i) => {
      if (!top) return { char, zhuyin: '', romanized: '', title };
      if (chars.length === 1) {
        return { char, zhuyin: top.transcription, romanized: top.converted, title };
      }
      if (zhuyin.length === chars.length) {
        return { char, zhuyin: zhuyin[i] ?? '', romanized: romanized[i] ?? '', title };
      }
      return { char, zhuyin: '', romanized: '', title };
    });
  });
}

function unit(u: Unit): HTMLElement {
  const node = el('div', 'unit', '', [
    el('span', 'zhuyin', u.zhuyin),
    el('span', 'romanized', u.romanized),
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

const LAYERS = ['zhuyin', 'romanized', 'hanzi'];

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

export function renderResults(results: Analysis[], view: Settings['view']): HTMLElement {
  return view === 'ruby' ? renderRuby(results) : paged(results, card, 'cards', 100);
}

export function renderMessage(text: string, className = ''): HTMLElement {
  return el('p', `message ${className}`, text);
}

export function renderOptions(settings: Settings, onChange: () => void): HTMLElement {
  const groups = options.map((option) => {
    const row = el('div', 'segmented');
    for (const choice of option.choices) {
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = option.id;
      input.value = choice.value;
      input.checked = settings[option.id] === choice.value;
      input.addEventListener('change', () => {
        (settings as unknown as Record<string, string>)[option.id] = choice.value;
        onChange();
      });
      row.append(el('label', 'seg', '', [input, el('span', '', choice.label)]));
    }
    return el('fieldset', 'option', '', [el('legend', '', option.label), row]);
  });
  return el('div', 'option-list', '', [el('p', 'panel-title', 'Options'), ...groups]);
}
