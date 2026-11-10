export interface Settings {
  view: 'cards' | 'ruby';
}

export interface Option {
  id: keyof Settings;
  label: string;
  choices: { value: string; label: string }[];
}

export const defaults: Settings = { view: 'cards' };

export const options: Option[] = [
  {
    id: 'view',
    label: 'Display',
    choices: [
      { value: 'cards', label: 'Cards' },
      { value: 'ruby', label: 'Ruby' },
    ],
  },
];
