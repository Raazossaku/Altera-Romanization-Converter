import './style.css';
import { lects } from './lects/index.ts';
import { renderOptions } from './options-panel.ts';
import { defaults, type Settings } from './options.ts';
import { present } from './present.ts';
import { copyText, renderMessage, renderResults } from './render.ts';
import type { Analysis, Lect } from './types.ts';

const base = import.meta.env.BASE_URL;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header>
    <a class="logo-link" href="https://www.atlasaltera.com/" aria-label="Atlas Altera">
      <img class="logo" src="${base}altera-logo.png" alt="" width="48" height="48" />
    </a>
    <div class="title">
      <h1>Altera Romanization Converter</h1>
      <p>Enter text to see its romanizations in different lects.</p>
    </div>
    <span class="maintained">Maintained by:<br />Raazossaku</span>
    <div class="github">
      <a class="source" href="https://github.com/Raazossaku/Altera-Romanization-Converter">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
        </svg>
        Source on GitHub
      </a>
    </div>
  </header>
  <main>
    <div class="workspace">
      <div class="input-panel">
        <label>
          Altera Lect
          <select id="lect"><button><selectedcontent></selectedcontent></button></select>
        </label>
        <label>
          Input Text
          <textarea id="input" rows="5" placeholder="Enter text...">一十百千萬億兆京</textarea>
        </label>
      </div>
      <aside class="options" id="options" aria-label="Options"></aside>
    </div>
    <div class="results-head">
      <h2>Romanization Candidates</h2>
      <div class="copy">
        <button type="button" id="copy-romanization">Copy romanization</button>
        <button type="button" id="copy-script"></button>
      </div>
    </div>
    <section id="results"></section>
  </main>
  <footer>
    <p>Built with TypeScript and Vite.</p>
    <p class="notes">
      Laoguoyin data: GPL-3.0, derived from
      <a href="https://github.com/baopaau/rime-bepemefeve">rime-bepemefeve</a>.<br />
      Korean data: BSD-3-Clause, derived from
      <a href="https://github.com/libhangul/libhangul">libhangul</a>.
      <a href="${base}NOTICE.md">Notice</a>
    </p>
  </footer>
`;

const select = document.querySelector<HTMLSelectElement>('#lect')!;
const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const results = document.querySelector<HTMLElement>('#results')!;
const optionsPanel = document.querySelector<HTMLElement>('#options')!;
const copyRomanization = document.querySelector<HTMLButtonElement>('#copy-romanization')!;
const copyScript = document.querySelector<HTMLButtonElement>('#copy-script')!;

const settings: Settings = { ...defaults };
interface Outcome {
  lect: Lect;
  results: Analysis[];
}

let outcome: Outcome | null = null;
let presented: Analysis[] = [];
let message = '';

for (const lect of lects) {
  const option = new Option('', lect.id);
  const name = document.createElement('span');
  name.textContent = lect.name;
  option.append(name);
  if (lect.detail) {
    const detail = document.createElement('span');
    detail.className = 'detail';
    detail.textContent = ` (${lect.detail})`;
    option.append(detail);
  }
  select.add(option);
}

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
  timer = window.setTimeout(update, 200);
}

copyRomanization.addEventListener('click', () => copy(copyRomanization, 'romanization'));
copyScript.addEventListener('click', () => copy(copyScript, 'script'));
mountOptions();
select.addEventListener('change', () => {
  mountOptions();
  schedule();
});
input.addEventListener('input', schedule);
update();
