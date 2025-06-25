import React from 'react';
import { Suggestion } from '../types';
import { getLevelColor, getLevelLabel } from '../utils';

interface TooltipProps {
  suggestion: Suggestion;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const Tooltip: React.FC<TooltipProps> = ({ 
  suggestion, 
  onAccept, 
  onReject,
}) => {
  return (
    <div 
      className="absolute z-10 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg transition-opacity duration-200 bottom-full left-1/2 transform -translate-x-1/2 mb-2"
    >
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-200"></div>
      
      <div className="mb-2">
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getLevelColor(suggestion.level)} bg-gray-100`}>
          Level {suggestion.level}: {getLevelLabel(suggestion.level)}
        </span>
      </div>
      
      <div className="mb-3">
        <p className="text-sm text-gray-700 font-medium">Issue:</p>
        <p className="text-sm text-gray-600">{suggestion.reason}</p>
      </div>
      
      {suggestion.replacement && (
        <div className="mb-3">
          <p className="text-sm text-gray-700 font-medium">Suggested:</p>
          <p className="text-sm text-green-600 bg-green-50 p-2 rounded border">
            {suggestion.replacement}
          </p>
        </div>
      )}

      {suggestion.status === 'pending' && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={(e) => { e.stopPropagation(); onReject(suggestion.id); }}
            className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
          >
            Reject (R)
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAccept(suggestion.id); }}
            className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Accept (A)
          </button>
        </div>
      )}
    </div>
  );
};

export default Tooltip; 