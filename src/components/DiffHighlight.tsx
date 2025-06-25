import React from 'react';
import { diffWordsWithSpace } from 'diff';

interface DiffHighlightProps {
  original: string;
  replacement: string;
}

const DiffHighlight: React.FC<DiffHighlightProps> = ({ original, replacement }) => {
  const parts = diffWordsWithSpace(original, replacement);

  return (
    <>
      {parts.map((part, index) => {
        const style = {
          backgroundColor: part.added ? 'rgba(34, 197, 94, 0.2)' : part.removed ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
          textDecoration: part.removed ? 'line-through' : 'none',
          padding: '1px 0',
        };
        
        return (
          <span key={index} style={style}>
            {part.value}
          </span>
        );
      })}
    </>
  );
};

export default DiffHighlight; 