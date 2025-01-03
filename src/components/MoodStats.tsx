
import { BarChart } from 'lucide-react';
import { JournalEntry } from '../types';
import { moodConfigs } from '../config/moods';

interface Props {
  entries: JournalEntry[];
}

export function MoodStats({ entries }: Props) {
  const moodCounts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = Object.values(moodCounts).reduce((sum, count) => sum + count, 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <BarChart className="h-5 w-5" />
        Mood Distribution
      </h3>
      
      <div className="space-y-3">
        {Object.entries(moodConfigs).map(([mood, config]) => {
          const count = moodCounts[mood] || 0;
          const percentage = total ? (count / total) * 100 : 0;
          
          return (
            <div key={mood} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="flex items-center gap-1">
                  <span>{config.emoji}</span>
                  <span>{config.label}</span>
                </span>
                <span className="text-gray-500">{count} entries</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: config.color
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}