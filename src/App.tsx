import React, { useState, useMemo, useEffect, useCallback } from 'react';
import Editor from './components/Editor';
import SuggestionOverlay from './components/SuggestionOverlay';
import ApiKeyInput from './components/ApiKeyInput';
import FocusSlider from './components/FocusSlider';
import { analyzeText } from './api';
import { processTextWithSuggestions } from './utils';
import { Suggestion, HighlightSpan } from './types';

function App() {
  const [text, setText] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [spans, setSpans] = useState<HighlightSpan[]>([]);
  const [history, setHistory] = useState<HighlightSpan[][]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [focusLevel, setFocusLevel] = useState<1 | 2 | 3>(1);

  const derivedText = useMemo(() => spans.map(s => s.text).join(''), [spans]);

  const handleAnalyzeText = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }
    setIsAnalyzing(true);
    setError(null);
    setSuggestions([]);
    try {
      const response = await analyzeText(text, apiKey);
      const suggestionsWithState = response.suggestions.map((s, index) => ({
        ...s,
        id: `${index}-${s.original}`,
        status: 'pending' as const,
      }));
      setSuggestions(suggestionsWithState);
      const processedSpans = processTextWithSuggestions(text, suggestionsWithState);
      setSpans(processedSpans);
      setHistory([]);
      setShowOverlay(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyText = () => {
    const textToCopy = showOverlay ? derivedText : text;
    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
  };

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  const handleSuggestionAction = (id: string, action: 'accept' | 'reject') => {
    setHistory(currentHistory => [...currentHistory, spans]);
    setSpans(currentSpans => {
      return currentSpans.map(span => {
        if (span.suggestion?.id === id) {
          const newStatus = action === 'accept' ? 'accepted' : 'rejected';
          const newText = action === 'accept' ? span.suggestion.replacement || span.text : span.text;
          
          return {
            ...span,
            text: newText,
            suggestion: { ...span.suggestion, status: newStatus },
          };
        }
        return span;
      });
    });
  };

  const handleUndo = useCallback(() => {
    if (history.length === 0) {
      return;
    }
    const lastState = history[history.length - 1];
    setSpans(lastState);
    setHistory(currentHistory => currentHistory.slice(0, -1));
  }, [history]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'u') {
        const target = event.target as HTMLElement;
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        event.preventDefault();
        handleUndo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo]);

  const handleEditorChange = (newText: string) => {
    setText(newText);
    // If text changes, the analysis is invalid
    if (showOverlay) {
      setSuggestions([]);
      setSpans([]);
      setShowOverlay(false);
      setHistory([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Writing Assistant
          </h1>
          <p className="text-gray-600">
            Get intelligent suggestions for grammar, structure, and content improvements
          </p>
        </div>

        {/* API Key Input */}
        <ApiKeyInput apiKey={apiKey} onApiKeyChange={setApiKey} />

        {showOverlay && spans.length > 0 && (
          <FocusSlider level={focusLevel} onChange={setFocusLevel} />
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {showOverlay ? 'Review Suggestions' : 'Your Text'}
            </h2>
            <div className="flex gap-3">
              <button
                onClick={handleCopyText}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {isCopied ? 'Copied!' : 'Copy'}
              </button>
              
              <button
                onClick={handleUndo}
                disabled={history.length === 0}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Undo
              </button>

              {suggestions.length > 0 ? (
                <button
                  onClick={() => setShowOverlay(!showOverlay)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  {showOverlay ? 'Back to Editor' : 'Review Suggestions'}
                </button>
              ) : (
                <button
                  onClick={handleAnalyzeText}
                  disabled={isAnalyzing || !text.trim() || !apiKey.trim()}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Text'}
                </button>
              )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {showOverlay && spans.length > 0 ? (
            <SuggestionOverlay 
              spans={spans} 
              onAccept={(id) => handleSuggestionAction(id, 'accept')}
              onReject={(id) => handleSuggestionAction(id, 'reject')}
              focusLevel={focusLevel}
            />
          ) : (
            <Editor
              text={text}
              onChange={handleEditorChange}
              disabled={isAnalyzing}
              placeholder="Paste or type your text here to get AI-powered writing suggestions..."
            />
          )}
        </div>

        {/* Legend */}
        {showOverlay && spans.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Suggestion Levels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-200 border-b-2 border-blue-600 rounded mr-3"></div>
                <div>
                  <p className="font-medium text-blue-800">Level 1: Grammar</p>
                  <p className="text-sm text-gray-600">Spelling, punctuation, subject-verb agreement</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-yellow-200 border-b-2 border-yellow-600 rounded mr-3"></div>
                <div>
                  <p className="font-medium text-yellow-800">Level 2: Structure</p>
                  <p className="text-sm text-gray-600">Sentence flow, cohesion, redundancy</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 border-b-2 border-green-600 rounded mr-3"></div>
                <div>
                  <p className="font-medium text-green-800">Accepted</p>
                  <p className="text-sm text-gray-600">Ready to be applied</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Click on a highlight to see details. Use (A) to accept and (R) to reject.
            </p>
          </div>
        )}

        {/* Sample Text Button */}
        {!text.trim() && (
          <div className="text-center mt-6">
            <button
              onClick={() => setText("This are a sample text with several issue's. The sentences is short. They dont flow well together. The argument lack supporting evidence and could be more persuasive with example's.")}
              className="text-sm text-blue-600 hover:text-blue-800 underline"
            >
              Load sample text with errors
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App; 