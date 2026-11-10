import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pack, type Lexicons } from '../src/lexicon.ts';
import { buildJosonese } from '../src/lects/josonese/build.ts';
import { buildLaoguoyin } from '../src/lects/laoguoyin/build.ts';

const read = (path: string) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

const outDir = new URL('../public/generated/', import.meta.url);
mkdirSync(outDir, { recursive: true });

const builds: Record<string, Lexicons> = {
  'laoguoyin.json': buildLaoguoyin(
    read('data/laoguoyin/Laoguoyin.txt'),
    read('data/laoguoyin/LaoguoyinPhrases.txt'),
  ),
  'korean.json': buildJosonese(read('data/korean/hanja.txt')),
};

for (const [name, lexicons] of Object.entries(builds)) {
  writeFileSync(new URL(name, outDir), JSON.stringify(pack(lexicons)));
}

console.log(`Wrote ${Object.keys(builds).join(' and ')} to public/generated/`);
