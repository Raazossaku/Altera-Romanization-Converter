const tones = new Map([
  ['ˊ', 2],
  ['ˇ', 3],
  ['ˋ', 4],
  ['˙', 5],
]);

const marks: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à', 'ạ'],
  e: ['e', 'ē', 'é', 'ě', 'è', 'ẹ'],
  ë: ['ë', 'ë̄', 'ë́', 'ë̌', 'ë̀', 'ẹ̈'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì', 'ị'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò', 'ọ'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù', 'ụ'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ', 'ụ̈'],
};

const initials = new Map([
  ['ㄅ', 'b'],
  ['ㄆ', 'p'],
  ['ㄇ', 'm'],
  ['ㄈ', 'f'],
  ['ㄪ', 'v'],
  ['ㄉ', 'd'],
  ['ㄊ', 't'],
  ['ㄋ', 'n'],
  ['ㄌ', 'l'],
  ['ㄍ', 'g'],
  ['ㄎ', 'k'],
  ['ㄫ', 'ng'],
  ['ㄏ', 'h'],
  ['ㄐ', 'j'],
  ['ㄑ', 'q'],
  ['ㄒ', 'x'],
  ['ㄬ', 'nj'],
  ['ㄓ', 'zh'],
  ['ㄔ', 'ch'],
  ['ㄕ', 'sh'],
  ['ㄖ', 'r'],
  ['ㄗ', 'z'],
  ['ㄘ', 'c'],
  ['ㄙ', 's'],
]);

const glideInitials = new Map([
  ['ㄧ', 'y'],
  ['ㄨ', 'w'],
  ['ㄩ', 'y'],
]);

const palatal = ['j', 'q', 'x', 'y', 'nj'];
const dental = ['z', 'c', 's', 'l'];
const sibilant = ['z', 'c', 's'];

type Final = (base: string, tone: number) => string;

const mark = (vowel: string, tone: number): string => marks[vowel]?.[tone] ?? vowel;

const plain =
  (vowel: string, coda = ''): Final =>
  (b, t) =>
    b + mark(vowel, t) + coda;

const iGlide =
  (vowel: string, coda = ''): Final =>
  (b, t) =>
    (b === 'y' ? b : b + 'i') + mark(vowel, t) + coda;

const uGlide =
  (vowel: string, coda = ''): Final =>
  (b, t) =>
    (b === 'w' ? b : b + 'u') + mark(vowel, t) + coda;

const üGlide =
  (vowel: string, coda = ''): Final =>
  (b, t) =>
    (palatal.includes(b) ? b + 'u' : dental.includes(b) ? b + 'ju' : b + 'ü') +
    mark(vowel, t) +
    coda;

const üBare =
  (coda = ''): Final =>
  (b, t) =>
    palatal.includes(b)
      ? b + mark('u', t) + coda
      : dental.includes(b)
        ? b + 'j' + mark('u', t) + coda
        : b + mark('ü', t) + coda;

const fallback = plain('i');

const finals = new Map<string, Final>([
  ['ㄧ', (b, t) => b + (sibilant.includes(b) ? 'j' : '') + mark('i', t)],
  ['ㄨ', plain('u')],
  ['ㄩ', üBare()],
  ['ㄚ', plain('a')],
  ['ㄧㄚ', iGlide('a')],
  ['ㄨㄚ', uGlide('a')],
  ['ㄛ', plain('o')],
  ['ㄧㄛ', iGlide('o')],
  ['ㄨㄛ', uGlide('o')],
  ['ㄩㄛ', üGlide('o')],
  ['ㄜ', plain('e')],
  ['ㄝ', plain('ë')],
  ['ㄧㄝ', iGlide('e')],
  ['ㄩㄝ', üGlide('e')],
  ['ㄞ', plain('a', 'i')],
  ['ㄧㄞ', iGlide('a', 'i')],
  ['ㄨㄞ', uGlide('a', 'i')],
  ['ㄟ', plain('e', 'i')],
  ['ㄨㄟ', (b, t) => (b === 'w' ? b + mark('e', t) + 'i' : b + 'u' + mark('i', t))],
  ['ㄠ', plain('a', 'o')],
  ['ㄧㄠ', iGlide('a', 'o')],
  ['ㄡ', plain('o', 'u')],
  ['ㄧㄡ', (b, t) => (b === 'y' ? b + mark('o', t) + 'u' : b + 'i' + mark('u', t))],
  ['ㄢ', plain('a', 'n')],
  ['ㄧㄢ', iGlide('a', 'n')],
  ['ㄨㄢ', uGlide('a', 'n')],
  ['ㄩㄢ', üGlide('a', 'n')],
  ['ㄣ', plain('e', 'n')],
  ['ㄧㄣ', plain('i', 'n')],
  ['ㄨㄣ', (b, t) => (b === 'w' ? b + mark('e', t) + 'n' : b + mark('u', t) + 'n')],
  ['ㄩㄣ', üBare('n')],
  ['ㄤ', plain('a', 'ng')],
  ['ㄧㄤ', iGlide('a', 'ng')],
  ['ㄨㄤ', uGlide('a', 'ng')],
  ['ㄥ', plain('e', 'ng')],
  ['ㄧㄥ', plain('i', 'ng')],
  ['ㄨㄥ', plain('o', 'ng')],
  ['ㄩㄥ', (b, t) => (b === 'y' ? b + mark('o', t) + 'ng' : b + 'i' + mark('o', t) + 'ng')],
  ['ㄦ', plain('e', 'r')],
]);

function convertSyllable(syllable: string): string {
  let rest = syllable;
  let tone = 1;
  const last = tones.get(rest.slice(-1));
  if (rest.length > 1 && last !== undefined) {
    tone = last;
    rest = rest.slice(0, -1);
  }
  if (rest.startsWith('·')) {
    rest = rest.slice(1);
    tone = 0;
  }
  const first = rest.slice(0, 1);
  let base = '';
  if (initials.has(first)) {
    base = initials.get(first)!;
    rest = rest.slice(1);
  } else if (glideInitials.has(first)) {
    base = glideInitials.get(first)!;
  }
  return (finals.get(rest) ?? fallback)(base, tone);
}

export function lgyToPinyin(transcription: string): string {
  return transcription
    .split(/\s+/)
    .filter((syllable) => syllable !== '')
    .map(convertSyllable)
    .join(' ');
}
