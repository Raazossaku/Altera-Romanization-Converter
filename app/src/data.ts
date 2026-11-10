import { unpack, type LexiconFile, type Lexicons } from './lexicon.ts';

export function dataLoader(file: string): () => Promise<Lexicons> {
  let loading: Promise<Lexicons> | null = null;

  async function fetchData(): Promise<Lexicons> {
    const response = await fetch(`${import.meta.env.BASE_URL}generated/${file}`);
    if (!response.ok) {
      throw new Error(`Could not load ${file} (HTTP ${response.status})`);
    }
    return unpack((await response.json()) as LexiconFile);
  }

  return () => {
    loading ??= fetchData();
    loading.catch(() => {
      loading = null;
    });
    return loading;
  };
}
