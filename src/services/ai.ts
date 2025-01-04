import type { JournalEntry } from '../types';

interface InsightParams {
  user_id: string;
  content: string;
  mood: JournalEntry['mood'];
  day_section: JournalEntry['day_section'];
  created_at: string;
}

interface APIError {
  error: {
    code: string;
    message: string;
  };
}

const MISTRAL_API_ENDPOINT = 'https://api.mistral.ai/v1/chat/completions';

const systemPrompt = `You are an empathetic AI journaling assistant. Analyze the journal entry and provide:
1. A relevant inspiring quote based on the content
2. 2-3 thoughtful reflection questions that help dig deeper
3. 1-2 actionable goals based on their current situation
4. 1-2 personalized affirmations that resonate with their mood and challenges
5. A brief emotional analysis

Keep responses concise and practical. Focus on growth and emotional well-being.`;

export function getUserApiKey(): string | null {
  return localStorage.getItem('user_mistral_api_key');
}

export async function generateInsights(params: InsightParams): Promise<string> {
  if (!params.content || !params.mood || !params.day_section) {
    throw new Error('Missing required parameters for generating insights');
  }

  const userApiKey = getUserApiKey();
  const apiKey = userApiKey || import.meta.env.VITE_MISTRAL_API_KEY;

  if (!apiKey) {
    throw new Error('Missing Mistral API key');
  }

  const userPrompt = `Journal Entry:
Content: ${params.content}
Current Mood: ${params.mood}
Time of Day: ${params.day_section}

Please provide insights following the format:
Quote: "..."
Reflection: (questions)
Goals: (actionable items)
Affirmations: (personalized)
Analysis: (brief emotional insight)`;

  try {
    const response = await fetch(MISTRAL_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "mistral-small",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json() as APIError;
      
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      }
      
      if (response.status === 429 || errorData.error?.message?.includes('rate limit')) {
        throw new Error('API_RATE_LIMIT');
      }
      
      throw new Error(errorData.error?.message || `API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating insights:', error);
    throw error;
  }
}