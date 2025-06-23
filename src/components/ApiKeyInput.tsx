import React, { useState } from 'react';

interface ApiKeyInputProps {
  onApiKeyChange: (apiKey: string) => void;
  apiKey: string;
}

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onApiKeyChange, apiKey }) => {
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
          OpenAI API Key
        </label>
        <button
          type="button"
          onClick={() => setShowKey(!showKey)}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          {showKey ? 'Hide' : 'Show'}
        </button>
      </div>
      <input
        id="api-key"
        type={showKey ? 'text' : 'password'}
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
        placeholder="sk-..."
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <p className="mt-2 text-xs text-gray-600">
        Your API key is stored locally and never sent to our servers. Get yours at{' '}
        <a 
          href="https://platform.openai.com/api-keys" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          OpenAI Platform
        </a>
      </p>
    </div>
  );
};

export default ApiKeyInput; 