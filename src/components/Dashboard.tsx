import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { JournalEntry, DaySection } from '../types';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import { JournalEntryComponent } from './JournalEntry';
import { MoodStats } from './MoodStats';
import { CalendarView } from './Calendar';
import { AIInsights } from './AIInsights';
import { moodConfigs } from '../config/moods';
import { daySectionConfigs } from '../config/daySections';
import { generateInsights } from '../services/ai';

export function Dashboard() {
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    try {
      const { data: entries, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(entries || []);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEntry = async (content: string, mood: JournalEntry['mood'], daySection: DaySection) => {
    if (!user) return;

    try {
      const insights = await generateInsights({
        user_id: user.id,
        content,
        mood,
        day_section: daySection,
        created_at: new Date().toISOString()
      });

      const { error } = await supabase.from('journal_entries').insert([
        {
          user_id: user.id,
          content,
          mood,
          day_section: daySection,
          ai_insights: insights
        },
      ]);

      if (error) throw error;
      await loadEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  const userEmail = user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 space-y-8">
        <header className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back, {userEmail}!
          </h1>
          <p className="text-gray-600 mt-2">Track your thoughts and emotions throughout the day</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MoodStats entries={entries} />
          <CalendarView entries={entries} />
        </div>

        <JournalEntryComponent onSave={handleSaveEntry} />

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Recent Entries</h2>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : entries.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No entries yet</div>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => {
                const moodConfig = moodConfigs[entry.mood];
                const sectionConfig = daySectionConfigs[entry.day_section || 'morning'];
                
                if (!moodConfig || !sectionConfig) {
                  console.error('Invalid mood or section configuration:', entry);
                  return null;
                }

                return (
                  <article
                    key={entry.id}
                    className="bg-white rounded-lg shadow-md p-6 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <time className="text-sm text-gray-500">
                          {format(new Date(entry.created_at), 'PPP')}
                        </time>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span>{sectionConfig.icon}</span>
                          <span>{sectionConfig.label}</span>
                        </div>
                      </div>
                      <span className="text-2xl" title={moodConfig.label}>
                        {moodConfig.emoji}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 whitespace-pre-wrap">{entry.content}</p>

                    {entry.ai_insights && (
                      <AIInsights insights={entry.ai_insights} />
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}