import { el } from './dom.ts';
import { options, type Settings } from '../core/options.ts';
import type { Lect } from '../core/types.ts';

export function renderOptions(settings: Settings, lect: Lect, onChange: () => void): HTMLElement {
  const groups = options
    .filter((option) => option.available?.(lect) ?? true)
    .map((option) => {
      if (option.kind === 'switch') {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.role = 'switch';
        input.checked = settings[option.id];
        input.addEventListener('change', () => {
          Object.assign(settings, { [option.id]: input.checked });
          onChange();
        });
        return el('label', 'switch', '', [el('span', '', option.label(lect)), input]);
      }
      const row = el('div', 'segmented');
      for (const choice of option.choices) {
        const input = document.createElement('input');
        input.type = 'radio';
        input.name = option.id;
        input.value = choice.value;
        input.checked = settings[option.id] === choice.value;
        input.addEventListener('change', () => {
          Object.assign(settings, { [option.id]: choice.value });
          onChange();
        });
        row.append(el('label', 'seg', '', [input, el('span', '', choice.label)]));
      }
      return el('fieldset', 'option', '', [el('legend', '', option.label(lect)), row]);
    });
  return el('div', 'option-list', '', [el('p', 'panel-title', 'Options'), ...groups]);
}
