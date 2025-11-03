export interface QuestionnaireQuestion {
  id: string;
  question: string;
  options: string[];
  scores?: number[];
  types?: string[];
}

export type QuestionnaireAnswers = Record<string, string>;
export type FitzpatrickType = 1 | 2 | 3 | 4 | 5 | 6;
