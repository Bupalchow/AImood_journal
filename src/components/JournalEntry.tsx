import { useState } from 'react';
import type { Mood, DaySection } from '../types';
import { moodConfigs } from '../config/moods';
import { daySectionConfigs } from '../config/daySections';

interface Props {
  onSave: (content: string, mood: Mood, daySection: DaySection) => Promise<void>;
}

export function JournalEntryComponent({ onSave }: Props) {
  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood>('neutral');
  const [daySection, setDaySection] = useState<DaySection>('morning');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(content, mood, daySection);
      setContent('');
      setMood('neutral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4">New Journal Entry</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Time of Day</label>
          <div className="flex gap-4 justify-center">
            {Object.entries(daySectionConfigs).map(([value, config]) => (
              <button
                key={value}
                type="button"
                onClick={() => setDaySection(value as DaySection)}
                className={`flex flex-col items-center p-4 rounded-lg transition-all ${
                  daySection === value
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="text-2xl mb-1">{config.icon}</span>
                <span className="text-sm font-medium">{config.label}</span>
                <span className="text-xs text-gray-500">{config.timeRange}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">How are you feeling?</label>
          <div className="flex gap-4 justify-center">
            {Object.entries(moodConfigs).map(([value, config]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMood(value as Mood)}
                className={`p-4 rounded-full transition-all ${
                  mood === value
                    ? 'scale-110 text-white'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
                style={{
                  backgroundColor: mood === value ? config.color : 'transparent'
                }}
                title={config.label}
              >
                <span className="text-2xl">{config.emoji}</span>
                <span className="sr-only">{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Your thoughts</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Write your thoughts here..."
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
}