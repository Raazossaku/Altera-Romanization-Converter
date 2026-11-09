import { describe, expect, it } from 'vitest';
import { lects } from './index.ts';

describe('lect registry', () => {
  it('has unique ids', () => {
    const ids = lects.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives every lect a name and an analyze function', () => {
    for (const lect of lects) {
      expect(lect.name).not.toBe('');
      expect(typeof lect.analyze).toBe('function');
    }
  });
});
