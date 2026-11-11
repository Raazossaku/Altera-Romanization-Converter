import { afterEach, describe, expect, it, vi } from 'vitest';
import { dataLoader } from './data.ts';

const file = { chars: { 一: [['ㄧ', 100]] }, phrases: {}, spelled: [] };

function stubFetch() {
  const fetchMock = vi.fn(async () => ({ ok: true, json: async () => file }));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('dataLoader', () => {
  it('fetches once and reuses the result', async () => {
    const fetchMock = stubFetch();
    const loader = dataLoader('x.json');
    await loader.load();
    await loader.load();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('fetches again after release', async () => {
    const fetchMock = stubFetch();
    const loader = dataLoader('x.json');
    await loader.load();
    loader.release();
    await loader.load();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('retries after a failed fetch', async () => {
    const fetchMock = vi.fn(async () => ({ ok: false, status: 500 }));
    vi.stubGlobal('fetch', fetchMock);
    const loader = dataLoader('x.json');
    await expect(loader.load()).rejects.toThrow('HTTP 500');
    await expect(loader.load()).rejects.toThrow('HTTP 500');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
