import { Suggestion, HighlightSpan } from './types';

export const processTextWithSuggestions = (text: string, suggestions: Suggestion[]): HighlightSpan[] => {
  if (!suggestions || !suggestions.length) {
    return [{ text, isHighlighted: false }];
  }

  const spans: HighlightSpan[] = [];
  let lastIndex = 0;
  let searchFromIndex = 0;

  suggestions.forEach((suggestion) => {
    const { original } = suggestion;

    if (!original) return;

    // Find the start index of the original text, starting from where the last match ended.
    const startIndex = text.indexOf(original, searchFromIndex);

    if (startIndex === -1) {
      console.warn(`Could not find original text from suggestion: "${original}"`);
      return; // Skips to the next suggestion
    }

    const endIndex = startIndex + original.length;

    // 1. Add the text segment *before* the current match
    if (startIndex > lastIndex) {
      spans.push({
        text: text.slice(lastIndex, startIndex),
        isHighlighted: false,
      });
    }

    // 2. Add the highlighted segment
    spans.push({
      text: text.slice(startIndex, endIndex),
      suggestion: suggestion,
      isHighlighted: true,
    });

    // 3. Update indices for the next iteration
    lastIndex = endIndex;
    searchFromIndex = endIndex;
  });

  // Add any remaining text after the last suggestion
  if (lastIndex < text.length) {
    spans.push({
      text: text.slice(lastIndex),
      isHighlighted: false,
    });
  }

  return spans;
};

export const getLevelClassName = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'highlight-level-1';
    case 2:
      return 'highlight-level-2';
    case 3:
      return 'highlight-level-3';
    default:
      return '';
  }
};

export const getLevelColor = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'text-blue-600';
    case 2:
      return 'text-yellow-600';
    case 3:
      return 'text-red-600';
    default:
      return '';
  }
};

export const getLevelLabel = (level: 1 | 2 | 3): string => {
  switch (level) {
    case 1:
      return 'Grammar';
    case 2:
      return 'Structure';
    case 3:
      return 'Content';
    default:
      return '';
  }
};

export const highlightTextWithSuggestions = processTextWithSuggestions; 