import type { Lect } from './types.ts';

export interface Settings {
  view: 'cards' | 'ruby';
  showScript: boolean;
  showRare: boolean;
  case: 'lower' | 'title' | 'caps';
}

interface Base {
  label: (lect: Lect) => string;
  available?: (lect: Lect) => boolean;
}

export type Option =
  | (Base & {
      kind: 'choice';
      id: 'view' | 'case';
      choices: { value: string; label: string }[];
    })
  | (Base & { kind: 'switch'; id: 'showScript' | 'showRare' });

export const defaults: Settings = {
  view: 'cards',
  showScript: true,
  showRare: true,
  case: 'lower',
};

export const options: Option[] = [
  { kind: 'switch', id: 'showScript', label: (lect) => `Show ${lect.scriptName}` },
  {
    kind: 'switch',
    id: 'showRare',
    label: () => 'Show rare readings',
    available: (lect) => lect.hasRarity === true,
  },
  {
    kind: 'choice',
    id: 'view',
    label: () => 'Display',
    choices: [
      { value: 'cards', label: 'Cards' },
      { value: 'ruby', label: 'Ruby' },
    ],
  },
  {
    kind: 'choice',
    id: 'case',
    label: () => 'Case',
    choices: [
      { value: 'lower', label: 'lower' },
      { value: 'title', label: 'Title' },
      { value: 'caps', label: 'CAPS' },
    ],
  },
];
