export interface Candidate {
  transcription: string;
  rare: boolean;
  percentage: number;
}

export interface Reading extends Candidate {
  converted: string;
}

export interface Analysis {
  text: string;
  readings: Reading[];
}

export interface Lect {
  id: string;
  name: string;
  analyze(input: string): Promise<Analysis[]>;
}
