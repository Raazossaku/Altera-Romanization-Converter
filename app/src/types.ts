export interface Candidate {
  script: string;
  rare: boolean;
  percentage: number;
}

export interface Reading extends Candidate {
  romanization: string;
}

export interface Analysis {
  text: string;
  readings: Reading[];
}

export interface Lect {
  id: string;
  name: string;
  detail?: string;
  scriptName: string;
  scriptSeparator: string;
  hasRarity?: boolean;
  joinRomanization: (syllables: string[]) => string;
  analyze(input: string): Promise<Analysis[]>;
}
