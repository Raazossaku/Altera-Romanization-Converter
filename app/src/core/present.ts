import type { Settings } from './options.ts';
import type { Analysis, Lect } from './types.ts';

export function applyCase(text: string, casing: Settings['case']): string {
  if (casing === 'caps') return text.toUpperCase();
  if (casing === 'title') return text.charAt(0).toUpperCase() + text.slice(1);
  return text;
}

export function present(results: Analysis[], settings: Settings, lect: Lect): Analysis[] {
  const hideRare = lect.hasRarity === true && !settings.showRare;
  return results.map((analysis) => {
    const common = analysis.readings.filter((r) => !r.rare);
    const kept = hideRare && common.length > 0 ? common : analysis.readings;
    return {
      ...analysis,
      readings: kept.map((r) => ({ ...r, romanization: applyCase(r.romanization, settings.case) })),
    };
  });
}
