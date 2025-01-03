import { JournalEntry } from '../../types';
import { analyzeEmotions } from './analyzers/emotionAnalyzer';
import { generateReflectionPrompts } from './generators/promptGenerator';
import { generateMotivationalQuote } from './generators/quoteGenerator';

export async function generateInsights(entry: Omit<JournalEntry, 'id' | 'ai_insights'>) {
  try {
    // Analyze emotions first
    const emotionAnalysis = await analyzeEmotions(entry as JournalEntry);

    // Generate personalized content based on analysis
    const [prompts, quote] = await Promise.all([
      generateReflectionPrompts(emotionAnalysis),
      generateMotivationalQuote(emotionAnalysis)
    ]);

    // Format insights
    return `
${quote.text}${quote.author ? ` - ${quote.author}` : ''}

Reflection Prompts:
${prompts.prompts.map((prompt, i) => `${i + 1}. ${prompt}`).join('\n')}

Daily Affirmations:
${prompts.affirmations.map((affirmation, i) => `${i + 1}. ${affirmation}`).join('\n')}

Suggested Goals:
${prompts.goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}

Analysis: ${emotionAnalysis.reasoning}
    `.trim();
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return null;
  }
}