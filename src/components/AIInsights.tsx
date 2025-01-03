import { Brain, Quote, ListChecks, Target, Goal } from 'lucide-react';

interface Props {
  insights: string | null;
}

export function AIInsights({ insights }: Props) {
  if (!insights) return null;

  // Parse different sections from the insights string
  const sections = insights.split('\n\n').reduce((acc, section) => {
    if (section.startsWith('Reflection:')) acc.reflection = section.replace('Reflection:', '').trim();
    else if (section.startsWith('Affirmations:')) acc.affirmations = section.replace('Affirmations:', '').trim();
    else if (section.startsWith('Goals:')) acc.goals = section.replace('Goals:', '').trim();
    else if (section.startsWith('Analysis:')) acc.analysis = section.replace('Analysis:', '').trim();
    else acc.quote = section.trim();
    return acc;
  }, { quote: '', reflection: '', affirmations: '', goals: '', analysis: '' });

  return (
    <div className="space-y-6 p-6 bg-purple-50 rounded-lg">
      <h4 className="font-medium flex items-center gap-2 text-purple-700">
        <Brain className="h-5 w-5" />
        AI Insights
      </h4>

      {/* Quote Section */}
      {sections.quote && (
        <div className="flex items-start gap-3">
          <Quote className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <blockquote className="text-purple-900 italic">{sections.quote}</blockquote>
        </div>
      )}

      {/* Reflection Prompts */}
      {sections.reflection && (
        <div className="flex items-start gap-3">
          <ListChecks className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-medium text-purple-800 mb-2">Reflection</h5>
            <ul className="space-y-2 text-purple-900">
              {sections.reflection.split('\n').map((prompt, i) => (
                <li key={i}>{prompt}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Goals */}
      {sections.goals && (
        <div className="flex items-start gap-3">
          <Goal className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-medium text-purple-800 mb-2">Goals</h5>
            <ul className="space-y-2 text-purple-900">
              {sections.goals.split('\n').map((goal, i) => (
                <li key={i}>{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Affirmations */}
      {sections.affirmations && (
        <div className="flex items-start gap-3">
          <Target className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
          <div>
            <h5 className="font-medium text-purple-800 mb-2">Daily Affirmations</h5>
            <ul className="space-y-2 text-purple-900">
              {sections.affirmations.split('\n').map((affirmation, i) => (
                <li key={i}>{affirmation}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Analysis */}
      {sections.analysis && (
        <div className="text-sm text-purple-700 mt-4">
          {sections.analysis}
        </div>
      )}
    </div>
  );
}