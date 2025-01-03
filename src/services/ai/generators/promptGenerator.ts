import { EmotionAnalysis } from '../analyzers/emotionAnalyzer';

export interface ReflectionPrompts {
  prompts: string[];
  affirmations: string[];
  goals: string[];
}

export async function generateReflectionPrompts(analysis: EmotionAnalysis): Promise<ReflectionPrompts> {
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
        content: `Generate personalized reflection prompts based on emotional state. Return a JSON object with:
          - prompts: array of 3 reflective writing prompts
          - affirmations: array of 3 positive affirmations
          - goals: array of 3 achievable daily goals`
      }, {
        role: 'user',
        content: `Primary emotion: ${analysis.primaryEmotion}
                 Stress level: ${analysis.stressScore}
                 Anxiety level: ${analysis.anxietyScore}`
      }]
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}