export type Mood = 'excited' | 'happy' | 'neutral' | 'anxious' | 'sad';
export type DaySection = 'morning' | 'afternoon' | 'evening';

export interface MoodConfig {
  label: string;
  color: string;
  emoji: string;
}

export interface DaySectionConfig {
  label: string;
  timeRange: string;
  icon: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  mood: Mood;
  day_section: DaySection;
  created_at: string;
  ai_insights?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}