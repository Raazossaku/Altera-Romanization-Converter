import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { parseCharacters, parsePhrases, serialize } from '../src/lexicon.ts';

const read = (name: string) =>
  readFileSync(new URL(`../public/data/${name}`, import.meta.url), 'utf8');

const outDir = new URL('../public/generated/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const data = {
  chars: serialize(parseCharacters(read('Laoguoyin.txt'))),
  phrases: serialize(parsePhrases(read('LaoguoyinPhrases.txt'))),
};

writeFileSync(new URL('laoguoyin.json', outDir), JSON.stringify(data));
console.log('Wrote public/generated/laoguoyin.json');
