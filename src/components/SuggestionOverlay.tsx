import React from 'react';
import { HighlightSpan, Suggestion } from '../types';
import { getLevelClassName } from '../utils';
import Tooltip from './Tooltip';

interface SuggestionOverlayProps {
  spans: HighlightSpan[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const SuggestionOverlay: React.FC<SuggestionOverlayProps> = ({ spans, onAccept, onReject }) => {
  if (spans.length === 0) {
    return null;
  }

  const getHighlightClassName = (suggestion: Suggestion): string => {
    if (suggestion.status === 'accepted') {
      return 'highlight-accepted';
    }
    return getLevelClassName(suggestion.level);
  };

  return (
    <div className="w-full p-4 border border-gray-300 rounded-lg bg-white font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {spans.map((span, index) => {
        if (span.isHighlighted && span.suggestion && span.suggestion.status !== 'rejected') {
          return (
            <Tooltip 
              key={index} 
              suggestion={span.suggestion}
              onAccept={onAccept}
              onReject={onReject}
            >
              <span className={getHighlightClassName(span.suggestion)}>
                {span.text}
              </span>
            </Tooltip>
          );
        }
        return <span key={index}>{span.text}</span>;
      })}
    </div>
  );
};

export default SuggestionOverlay; 