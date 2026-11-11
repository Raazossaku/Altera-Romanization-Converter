import './ui/style.css';
import { mountLayout } from './ui/layout.ts';
import { lects } from './lects/index.ts';
import { renderOptions } from './ui/options-panel.ts';
import { defaults, type Settings } from './core/options.ts';
import { present } from './core/present.ts';
import { copyText } from './core/format.ts';
import { renderMessage, renderResults } from './ui/render.ts';
import type { Analysis, Lect } from './core/types.ts';

const { select, input, results, optionsPanel, copyRomanization, copyScript } = mountLayout(
  document.querySelector<HTMLDivElement>('#app')!,
  lects,
);

const settings: Settings = { ...defaults };

interface Outcome {
  lect: Lect;
  results: Analysis[];
}

let outcome: Outcome | null = null;
let presented: Analysis[] = [];
let message = '';

function currentLect(): Lect {
  return lects.find((l) => l.id === select.value) ?? lects[0]!;
}

function updateCopy(): void {
  copyRomanization.textContent = 'Copy romanization';
  copyScript.textContent = `Copy ${(outcome?.lect ?? currentLect()).scriptName}`;
  copyScript.hidden = !settings.showScript;
  copyRomanization.disabled = presented.length === 0;
  copyScript.disabled = presented.length === 0;
}

function show(): void {
  presented = outcome ? present(outcome.results, settings, outcome.lect) : [];
  results.replaceChildren(
    outcome ? renderResults(presented, settings, outcome.lect) : renderMessage(message),
  );
  updateCopy();
}

function copy(button: HTMLButtonElement, layer: 'script' | 'romanization'): void {
  if (!outcome) return;
  void navigator.clipboard.writeText(copyText(presented, layer, outcome.lect)).then(() => {
    button.textContent = 'Copied';
    setTimeout(updateCopy, 1200);
  });
}

function mountOptions(): void {
  optionsPanel.replaceChildren(renderOptions(settings, currentLect(), show));
}

let latest = 0;
let timer: number | undefined;

async function update(): Promise<void> {
  const request = ++latest;
  const lect = lects.find((l) => l.id === select.value);
  if (!lect || input.value.trim() === '') {
    outcome = null;
    message = 'Type some text above to see the results.';
    show();
    return;
  }
  outcome = null;
  message = 'Looking up phrases and characters…';
  show();
  try {
    const found = await lect.analyze(input.value);
    if (request !== latest) return;
    outcome = { lect, results: found };
    show();
  } catch (error) {
    if (request !== latest) return;
    results.replaceChildren(renderMessage(`Lookup failed: ${String(error)}`, 'error'));
  }
}

function schedule(): void {
  clearTimeout(timer);
  timer = window.setTimeout(update, 100);
}

copyRomanization.addEventListener('click', () => copy(copyRomanization, 'romanization'));
copyScript.addEventListener('click', () => copy(copyScript, 'script'));
mountOptions();
select.addEventListener('change', () => {
  for (const lect of lects) {
    if (lect !== currentLect()) lect.release();
  }
  mountOptions();
  schedule();
});
input.addEventListener('input', schedule);
update();
