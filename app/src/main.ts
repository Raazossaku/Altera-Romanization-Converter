import './style.css';
import { lects } from './lects/index.ts';
import { renderCards, renderMessage } from './render.ts';

const base = import.meta.env.BASE_URL;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <header>
    <h1>Altera Romanization Converter</h1>
    <p>Enter text to see its romanizations in different lects.</p>
  </header>
  <main>
    <label>
      Altera Lect
      <select id="lect"></select>
    </label>
    <label>
      Input Text
      <textarea id="input" rows="5" placeholder="輸入中文...">震旦國音正語</textarea>
    </label>
    <h2>Romanization Candidates</h2>
    <section id="results"></section>
  </main>
  <footer>
    <p>Built with TypeScript and Vite.</p>
    <p>
      Data: GPL-3.0, derived from
      <a href="https://github.com/baopaau/rime-bepemefeve">rime-bepemefeve</a>.
      <a href="${base}data/NOTICE.md">Notice</a>
    </p>
  </footer>
`;

const select = document.querySelector<HTMLSelectElement>('#lect')!;
const input = document.querySelector<HTMLTextAreaElement>('#input')!;
const results = document.querySelector<HTMLElement>('#results')!;

for (const lect of lects) {
  select.add(new Option(lect.name, lect.id));
}

let latest = 0;
let timer: number | undefined;

async function update(): Promise<void> {
  const request = ++latest;
  const lect = lects.find((l) => l.id === select.value);
  if (!lect || input.value.trim() === '') {
    results.replaceChildren(renderMessage('Type some Chinese text above to see the results.'));
    return;
  }
  results.replaceChildren(renderMessage('Looking up phrases and characters…'));
  try {
    const analysis = await lect.analyze(input.value);
    if (request === latest) results.replaceChildren(renderCards(analysis));
  } catch (error) {
    if (request === latest) {
      results.replaceChildren(renderMessage(`Lookup failed: ${String(error)}`, 'error'));
    }
  }
}

function schedule(): void {
  clearTimeout(timer);
  timer = window.setTimeout(update, 200);
}

select.addEventListener('change', schedule);
input.addEventListener('input', schedule);
update();
