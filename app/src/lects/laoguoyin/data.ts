import { deserialize, type Lexicon, type LexiconJson } from '../../lexicon.ts';

interface Data {
  chars: Lexicon;
  phrases: Lexicon;
}

async function fetchData(): Promise<Data> {
  const response = await fetch(`${import.meta.env.BASE_URL}generated/laoguoyin.json`);
  if (!response.ok) {
    throw new Error(`Could not load laoguoyin.json (HTTP ${response.status})`);
  }
  const json = (await response.json()) as { chars: LexiconJson; phrases: LexiconJson };
  return { chars: deserialize(json.chars), phrases: deserialize(json.phrases) };
}

let loading: Promise<Data> | null = null;

export function loadData(): Promise<Data> {
  loading ??= fetchData();
  loading.catch(() => {
    loading = null;
  });
  return loading;
}
