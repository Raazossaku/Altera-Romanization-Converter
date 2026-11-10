import './style.css';
import { lects } from './lects/index.ts';
import { defaults, type Settings } from './options.ts';
import { renderMessage, renderOptions, renderResults } from './render.ts';
import type { Analysis } from './types.ts';

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
          <select id="lect"></select>
        </label>
        <label>
          Input Text
          <textarea id="input" rows="5" placeholder="Enter text...">震旦國音正語</textarea>
        </label>
      </div>
      <aside class="options" id="options" aria-label="Options"></aside>
    </div>
    <h2>Romanization Candidates</h2>
    <section id="results"></section>
  </main>
  <footer>
    <p>Built with TypeScript and Vite.</p>
    <p>
      Laoguoyin data: GPL-3.0, derived from
      <a href="https://github.com/baopaau/rime-bepemefeve">rime-bepemefeve</a>.
      <a href="${base}data/NOTICE.md">Notice</a>
    </p>
  </footer>
`;

const select = document.querySelector<HTMLSelectElement>('#lect')!;
const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const results = document.querySelector<HTMLElement>('#results')!;
const optionsPanel = document.querySelector<HTMLElement>('#options')!;

const settings: Settings = { ...defaults };
let analysis: Analysis[] | null = null;
let message = '';

for (const lect of lects) {
  select.add(new Option(lect.name, lect.id));
}

function show(): void {
  results.replaceChildren(
    analysis ? renderResults(analysis, settings.view) : renderMessage(message),
  );
}

let latest = 0;
let timer: number | undefined;

async function update(): Promise<void> {
  const request = ++latest;
  const lect = lects.find((l) => l.id === select.value);
  if (!lect || input.value.trim() === '') {
    analysis = null;
    message = 'Type some text above to see the results.';
    show();
    return;
  }
  analysis = null;
  message = 'Looking up phrases and characters…';
  show();
  try {
    const found = await lect.analyze(input.value);
    if (request !== latest) return;
    analysis = found;
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

optionsPanel.append(renderOptions(settings, show));
select.addEventListener('change', schedule);
input.addEventListener('input', schedule);
update();
