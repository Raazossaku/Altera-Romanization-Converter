import assert from 'node:assert/strict';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pack, unpack, type Lexicons } from '../src/core/lexicon.ts';
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
  const json = JSON.stringify(pack(lexicons));
  const back = unpack(JSON.parse(json));
  assert.deepEqual(back.chars, lexicons.chars, `${name}: characters changed in packing`);
  assert.deepEqual(back.phrases, lexicons.phrases, `${name}: phrases changed in packing`);
  writeFileSync(new URL(name, outDir), json);
}

console.log(`Wrote ${Object.keys(builds).join(' and ')} to public/generated/`);
