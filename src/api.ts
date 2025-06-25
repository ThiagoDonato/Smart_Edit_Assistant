import { OpenAIResponse } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an expert writing assistant. Your sole task is to identify and suggest specific, necessary improvements to a given text. You must return these suggestions in a structured JSON format.

**CRITICAL RULES:**
1.  **Suggest ONLY if a change is needed.** Do not create suggestions for phrases that are already grammatically correct, cohesive, or content-wise sound. If a part of the text is correct, you MUST ignore it.
2.  **Your goal is precision, not commentary.** Do not provide suggestions that say "No change needed." If no change is needed, do not create a suggestion object for it.
3.  **The \`original\` must be the precise text to be replaced.** It should be unique enough for programmatic search, but it MUST contain the error or the part needing improvement. Do not use correct phrases as the 'original' text just for context.

For each necessary change, return an object in the \`suggestions\` array with the following keys:
- \`level\`: 1 (Grammar & Spelling), 2 (Cohesion & Structure), or 3 (Content & Clarity).
- \`original\`: The exact, original substring from the text that requires correction.
- \`replacement\`: Your suggested, improved alternative.
- \`reason\`: A concise explanation for why the change is necessary.

Return only a single JSON object with the key \`"suggestions"\`. The suggestions must be ordered as they appear in the original text.

**If the text requires no changes, you MUST return:**
{ "suggestions": [] }`;

export const analyzeText = async (text: string, apiKey: string): Promise<OpenAIResponse> => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        //model: 'gpt-4.1',
        model: 'gpt-4.1',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: text,
          },
        ],
        temperature: 0.1,
        response_format: { type: 'json_object' },
        max_tokens: 10000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();

    if (data.choices[0].finish_reason === 'length') {
      throw new Error('The response was truncated because it exceeded the maximum token limit. Please try a shorter text.');
    }
    
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response content from OpenAI');
    }

    // Content can be already an object when using JSON mode
    if (typeof content === 'object') {
      return content as OpenAIResponse;
    }

    // Fallback: try to parse string content
    try {
      const parsed = JSON.parse(content);
      return parsed;
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid JSON response from OpenAI');
    }
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}; 