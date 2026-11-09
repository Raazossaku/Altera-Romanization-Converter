import { parseCharacters, parsePhrases, type Lexicon } from '../../lexicon.ts';

interface Data {
  chars: Lexicon;
  phrases: Lexicon;
}

async function fetchText(name: string): Promise<string> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${name}`);
  if (!response.ok) {
    throw new Error(`Could not load ${name} (HTTP ${response.status})`);
  }
  return response.text();
}

let loading: Promise<Data> | null = null;

export function loadData(): Promise<Data> {
  loading ??= Promise.all([
    fetchText('Laoguoyin.txt'),
    fetchText('LaoguoyinPhrases.txt'),
  ]).then(([chars, phrases]) => ({
    chars: parseCharacters(chars),
    phrases: parsePhrases(phrases),
  }));
  loading.catch(() => {
    loading = null;
  });
  return loading;
}
