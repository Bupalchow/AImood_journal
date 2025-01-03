import { EmotionAnalysis } from '../analyzers/emotionAnalyzer';

export interface Quote {
  text: string;
  author?: string;
  context: string;
}

export async function generateMotivationalQuote(analysis: EmotionAnalysis): Promise<Quote> {
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
        content: `Generate an uplifting quote based on emotional state. Return a JSON object with:
          - text: the quote text
          - author: the quote author (if known)
          - context: brief explanation of why this quote is relevant`
      }, {
        role: 'user',
        content: `Emotion: ${analysis.primaryEmotion}
                 Context: ${analysis.reasoning}`
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}