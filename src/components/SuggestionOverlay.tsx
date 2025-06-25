import React, { useState, useRef, useEffect } from 'react';
import { HighlightSpan, Suggestion } from '../types';
import { getLevelClassName } from '../utils';
import Tooltip from './Tooltip';
import DiffHighlight from './DiffHighlight';

type FocusLevel = 1 | 2 | 3;

interface SuggestionOverlayProps {
  spans: HighlightSpan[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  focusLevel: FocusLevel;
}

const SuggestionOverlay: React.FC<SuggestionOverlayProps> = ({ spans, onAccept, onReject, focusLevel }) => {
  const [activeSuggestionId, setActiveSuggestionId] = useState<string | null>(null);

  const handleSuggestionClick = (id: string) => {
    setActiveSuggestionId(prevId => (prevId === id ? null : id));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!activeSuggestionId) return;

      if (event.key === 'a' || event.key === 'Enter') {
        onAccept(activeSuggestionId);
        setActiveSuggestionId(null);
      } else if (event.key === 'r' || event.key === 'Backspace') {
        onReject(activeSuggestionId);
        setActiveSuggestionId(null);
      } else if (event.key === 'Escape') {
        setActiveSuggestionId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSuggestionId, onAccept, onReject]);

  if (spans.length === 0) {
    return null;
  }

  const getHighlightClassName = (suggestion: Suggestion, isActive: boolean): string => {
    let className = '';
    if (suggestion.status === 'accepted') {
      className = 'highlight-accepted';
    } else {
      className = getLevelClassName(suggestion.level);
    }
    
    // Add opacity if another suggestion is active
    if (activeSuggestionId !== null && !isActive) {
      className += ' opacity-50';
    }
    
    // Add transition for smooth opacity change
    className += ' transition-opacity duration-200';
    
    return className;
  };

  return (
    <div className="w-full p-4 border border-gray-300 rounded-lg bg-white font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {spans.map((span, index) => {
        if (span.isHighlighted && span.suggestion && span.suggestion.status !== 'rejected') {
          if (span.suggestion.level > focusLevel) {
            return <span key={index}>{span.text}</span>;
          }

          const suggestionId = span.suggestion.id;
          const isActive = activeSuggestionId === suggestionId;

          return (
            <span
              key={index}
              className="relative inline"
              onClick={() => handleSuggestionClick(suggestionId)}
            >
              <span className={getHighlightClassName(span.suggestion, isActive)}>
                {span.suggestion.status === 'pending' && span.suggestion.replacement ? (
                  <DiffHighlight original={span.suggestion.original} replacement={span.suggestion.replacement} />
                ) : (
                  span.text
                )}
              </span>
              {isActive && (
                <Tooltip
                  suggestion={span.suggestion}
                  onAccept={onAccept}
                  onReject={onReject}
                />
              )}
            </span>
          );
        }
        return <span key={index}>{span.text}</span>;
      })}
    </div>
  );
};

export default SuggestionOverlay; 