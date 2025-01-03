import { JournalEntry } from '../types';

const MISTRAL_API_KEY = import.meta.env.MISTRAL_API_KEY;

export async function generateInsights(entry: Omit<JournalEntry, 'id' | 'ai_insights'>) {
  try {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`
      },
      body: JSON.stringify({
        model: 'mistral-tiny',
        messages: [{
          role: 'system',
          content: `You are an empathetic AI assistant analyzing journal entries. 
          Provide insights in the following format:

          Quote: An inspirational quote relevant to the entry
          
          Reflection: 3 reflection prompts based on the entry
          
          Goals: 2-3 suggested actionable goals
          
          Affirmations: 2-3 positive affirmations
          
          Analysis: A brief emotional analysis of the entry (2 sentences max)`
        }, {
          role: 'user',
          content: `Mood: ${entry.mood}
          Time: ${entry.day_section}
          Entry: ${entry.content}`
        }]
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
}