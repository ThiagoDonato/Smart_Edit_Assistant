import React, { useRef, useEffect } from 'react';

interface EditorProps {
  text: string;
  onChange: (text: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({ 
  text, 
  onChange, 
  disabled = false, 
  placeholder = "Enter your text here..." 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [text]);

  return (
    <div className="w-full">
      <textarea
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full p-4 border border-gray-300 rounded-lg font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
          disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'
        }`}
        style={{
          minHeight: '200px',
          maxHeight: '400px',
        }}
      />
    </div>
  );
};

export default Editor; 