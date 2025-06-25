import { OpenAIResponse } from './types';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are an intelligent writing assistant. Your job is to return specific editing suggestions in structured JSON format.

For the text you receive, identify areas for improvement and for each one, return an object in the \`suggestions\` array.

Each suggestion object must include:
- \`level\`: 1 (Grammar), 2 (Cohesion/Structure), or 3 (Content).
- \`original\`: The exact, original substring from the text. **Include enough surrounding context** to make this substring unique. For example, instead of just "is", return "This is a example".
- \`replacement\`: Your suggested alternative.
- \`reason\`: A short explanation of the improvement.

Return only a single JSON object with the key \`"suggestions"\`. The suggestions should be ordered as they appear in the original text.

If there are no issues, return:
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