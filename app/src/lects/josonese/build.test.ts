import { describe, expect, it } from 'vitest';
import { pack } from '../../lexicon.ts';
import { buildJosonese } from './build.ts';

const sample = `
리:利:
이:利:
녀:女:
여:女:
내:來:
래:來:
일:日:
심:心:
리:理:
이:理:
리용:利用:
이용:利用:
내일:來日:
심리:心理:
용:用:
륙:六:
월:月:
수:數:
삭:數:
자:字:
유월:六月:
숫자:數字:
락:樂:
낙:樂:
악:樂:
원:園:
낙원:樂園:
`;

describe('buildJosonese', () => {
  const lexicons = buildJosonese(sample);
  const file = pack(lexicons);

  it('drops lenited character readings', () => {
    const { entries } = lexicons.chars;
    expect(entries.get('利')).toEqual([{ script: '리', rare: false, percentage: 100 }]);
    expect(entries.get('女')).toEqual([{ script: '녀', rare: false, percentage: 100 }]);
  });

  it('restores initials inside words', () => {
    expect(file.phrases['樂園']).toEqual([['락 원', 100]]);
  });

  it('respells irregular and linking-s syllables', () => {
    expect(file.phrases['六月']).toEqual([['류 월', 100]]);
    expect(file.phrases['數字']).toEqual([['수 자', 100]]);
  });

  it('lists words the characters already spell out without a reading', () => {
    expect(file.spelled).toContain('來日');
    expect(file.spelled).toContain('心理');
    expect(file.phrases['來日']).toBeUndefined();
    expect(file.phrases['樂園']).toBeDefined();
  });
});
