import { unpack, type LexiconFile, type Lexicons } from './lexicon.ts';

export interface DataLoader {
  load(): Promise<Lexicons>;
  release(): void;
}

export function dataLoader(file: string): DataLoader {
  let loading: Promise<Lexicons> | null = null;

  async function fetchData(): Promise<Lexicons> {
    const response = await fetch(`${import.meta.env.BASE_URL}generated/${file}`);
    if (!response.ok) {
      throw new Error(`Could not load ${file} (HTTP ${response.status})`);
    }
    return unpack((await response.json()) as LexiconFile);
  }

  return {
    load() {
      const current = (loading ??= fetchData());
      current.catch(() => {
        if (loading === current) loading = null;
      });
      return current;
    },
    release() {
      loading = null;
    },
  };
}
