import { MoodConfig } from '../types';

export const moodConfigs: Record<string, MoodConfig> = {
  excited: {
    label: 'Excited',
    color: '#8B5CF6',
    emoji: '🤩'
  },
  happy: {
    label: 'Happy',
    color: '#10B981',
    emoji: '😊'
  },
  neutral: {
    label: 'Neutral',
    color: '#6B7280',
    emoji: '😐'
  },
  anxious: {
    label: 'Anxious',
    color: '#F59E0B',
    emoji: '😰'
  },
  sad: {
    label: 'Sad',
    color: '#EF4444',
    emoji: '😢'
  }
};