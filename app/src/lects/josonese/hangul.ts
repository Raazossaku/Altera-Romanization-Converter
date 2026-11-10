const BASE = 0xac00;
const LAST = 0xd7a3;

const INITIAL_SOUNDS = [
  'g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss',
  '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h',
];
const MEDIAL_SOUNDS = [
  'a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo',
  'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i',
];
const FINAL_SOUNDS = [
  '', 'k', 'kk', 'ks', 'n', 'nj', 'nh', 't', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh',
  'm', 'p', 'ps', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h',
];

const INITIAL = {
  G: 0, N: 2, D: 3, R: 5, M: 6, B: 7, S: 9, NG: 11, CH: 14, K: 15, T: 16, P: 17, H: 18,
} as const;

const FINAL = { G: 1, N: 4, D: 7, L: 8, M: 16, B: 17, S: 19, NG: 21, J: 22 } as const;

const IOTIZED_MEDIALS = new Set([2, 3, 6, 7, 12, 17, 20]);

const LIAISON = new Map<number, number>([
  [FINAL.G, INITIAL.G],
  [FINAL.N, INITIAL.N],
  [FINAL.D, INITIAL.D],
  [FINAL.L, INITIAL.R],
  [FINAL.M, INITIAL.M],
  [FINAL.B, INITIAL.B],
  [FINAL.S, INITIAL.S],
]);

const ASPIRATION = new Map<number, number>([
  [FINAL.G, INITIAL.K],
  [FINAL.D, INITIAL.T],
  [FINAL.B, INITIAL.P],
  [FINAL.J, INITIAL.CH],
]);

const FINAL_AS_T = new Set<number>([FINAL.D, FINAL.S]);

interface Parts {
  initial: number;
  medial: number;
  final: number;
}

function decompose(syllable: string): Parts | null {
  const code = syllable.codePointAt(0);
  if (code === undefined || code < BASE || code > LAST) return null;
  const offset = code - BASE;
  return {
    initial: Math.floor(offset / 588),
    medial: Math.floor((offset % 588) / 28),
    final: offset % 28,
  };
}

function compose({ initial, medial, final }: Parts): string {
  return String.fromCodePoint(BASE + initial * 588 + medial * 28 + final);
}

export function dropFinal(syllable: string): string {
  const parts = decompose(syllable);
  return parts ? compose({ ...parts, final: 0 }) : syllable;
}

export function hasSaiSiot(syllable: string): boolean {
  return decompose(syllable)?.final === FINAL.S;
}

export function lenite(syllable: string): string {
  const parts = decompose(syllable);
  if (!parts) return syllable;
  const iotized = IOTIZED_MEDIALS.has(parts.medial);
  if (parts.initial === INITIAL.R) {
    return compose({ ...parts, initial: iotized ? INITIAL.NG : INITIAL.N });
  }
  if (parts.initial === INITIAL.N && iotized) {
    return compose({ ...parts, initial: INITIAL.NG });
  }
  return syllable;
}

function assimilate(left: Parts, right: Parts): void {
  const aspirated = ASPIRATION.get(left.final);
  if (right.initial === INITIAL.H && aspirated !== undefined) {
    left.final = 0;
    right.initial = aspirated;
    return;
  }
  if (right.initial === INITIAL.NG) {
    const onset = LIAISON.get(left.final);
    if (onset !== undefined) {
      right.initial = onset;
      left.final = 0;
    }
    return;
  }
  if (right.initial === INITIAL.R) {
    if (left.final === FINAL.N) left.final = FINAL.L;
    else if (left.final === FINAL.G) left.final = FINAL.NG;
    else if (left.final === FINAL.B) left.final = FINAL.M;
    return;
  }
  if (right.initial === INITIAL.N || right.initial === INITIAL.M) {
    if (left.final === FINAL.G) left.final = FINAL.NG;
    else if (left.final === FINAL.B) left.final = FINAL.M;
    else if (FINAL_AS_T.has(left.final)) left.final = FINAL.N;
    else if (left.final === FINAL.L && right.initial === INITIAL.N) right.initial = INITIAL.R;
  }
}

function sound(parts: Parts, afterL: boolean): string {
  const initial =
    parts.initial === INITIAL.R && afterL ? 'l' : INITIAL_SOUNDS[parts.initial]!;
  const final = FINAL_AS_T.has(parts.final) ? 't' : FINAL_SOUNDS[parts.final]!;
  return initial + MEDIAL_SOUNDS[parts.medial]! + final;
}

export function hangulToRoman(reading: string): string {
  const syllables = reading.split(/\s+/);
  const parts = syllables.map(decompose);
  for (let i = 0; i + 1 < parts.length; i++) {
    const left = parts[i];
    const right = parts[i + 1];
    if (left && right) assimilate(left, right);
  }
  return parts
    .map((p, i) => (p ? sound(p, parts[i - 1]?.final === FINAL.L) : syllables[i]!))
    .join(' ');
}
