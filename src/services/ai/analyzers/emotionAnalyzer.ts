import { JournalEntry } from '../../../types';

export interface EmotionAnalysis {
  stressScore: number;
  anxietyScore: number;
  primaryEmotion: string;
  reasoning: string;
}

export async function analyzeEmotions(entry: JournalEntry): Promise<EmotionAnalysis> {
  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.MISTRAL_API_KEY}`
    },
    body: JSON.stringify({
      model: 'mistral-tiny',
      messages: [{
        role: 'system',
        content: `Analyze the emotional content of this journal entry. Return a JSON object with:
          - stressScore (0-100)
          - anxietyScore (0-100)
          - primaryEmotion (string)
          - reasoning (brief explanation)`
      }, {
        role: 'user',
        content: entry.content
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}