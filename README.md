# AI Writing Assistant

A web-based AI writing assistant that provides intelligent suggestions for grammar, structure, and content improvements using GPT-4o.

## Features

- **Three-Level Suggestion System:**
  - **Level 1 (Blue)**: Grammar corrections (spelling, punctuation, subject-verb agreement)
  - **Level 2 (Yellow)**: Sentence structure and cohesion improvements
  - **Level 3 (Red)**: Content-level suggestions (examples, clarity, paragraph structure)

- **Interactive Interface:**
  - Clean, responsive editor with auto-resize
  - Inline highlighting with color-coded suggestions
  - Hover tooltips with detailed explanations and suggested replacements
  - Real-time analysis using OpenAI's GPT-4o API

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Get an OpenAI API key:**
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account and generate an API key
   - The key should start with `sk-`

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - Enter your OpenAI API key in the provided field
   - Start analyzing your text!

## Usage

1. **Enter your OpenAI API key** in the secure input field at the top
2. **Type or paste your text** into the editor
3. **Click "Analyze Text"** to get AI-powered suggestions
4. **Hover over highlighted text** to see detailed suggestions and recommendations
5. **Click "Edit Text"** to return to editing mode

## Sample Text

Click "Load sample text with errors" to try the application with pre-loaded text containing various issues.

## Tech Stack

- **React 18** with TypeScript
- **TailwindCSS** for styling
- **OpenAI GPT-4o API** for text analysis
- **Custom highlighting system** with character-range based suggestions

## Project Structure

```
src/
├── components/
│   ├── Editor.tsx          # Text input component
│   ├── SuggestionOverlay.tsx # Highlighted text display
│   ├── Tooltip.tsx         # Hover suggestions
│   └── ApiKeyInput.tsx     # Secure API key input
├── api.ts                  # OpenAI API integration  
├── utils.ts                # Text processing utilities
├── types.ts                # TypeScript type definitions
├── App.tsx                 # Main application component
└── index.tsx               # Application entry point
```

## API Integration

The application sends structured prompts to GPT-4o and expects JSON responses in the following format:

```json
{
  "suggestions": [
    {
      "level": 1,
      "start": 0,
      "end": 15,
      "original": "This are wrong",
      "replacement": "This is wrong",
      "reason": "Subject-verb agreement error"
    }
  ]
}
```

## Security

- API keys are stored locally in browser memory only
- No data is sent to external servers except OpenAI
- All communication with OpenAI uses HTTPS

## Development

To extend or modify the application:

1. **Add new suggestion levels**: Update the `Suggestion` type and utility functions
2. **Customize highlighting**: Modify CSS classes in `index.css`
3. **Enhance tooltips**: Update the `Tooltip` component
4. **Adjust API prompts**: Modify the system prompt in `api.ts`

## License

This project is provided as-is for educational and demonstration purposes. 