export interface Suggestion {
  id: string;
  status: 'pending' | 'accepted' | 'rejected';
  level: 1 | 2 | 3;
  original: string;
  replacement?: string;
  reason: string;
}

export interface OpenAIResponse {
  suggestions: Suggestion[];
}

export interface HighlightSpan {
  text: string;
  suggestion?: Suggestion;
  isHighlighted: boolean;
} 