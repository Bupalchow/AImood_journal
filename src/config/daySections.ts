import { DaySectionConfig } from '../types';

export const daySectionConfigs: Record<string, DaySectionConfig> = {
  morning: {
    label: 'Morning',
    timeRange: '6 AM - 12 PM',
    icon: '🌅'
  },
  afternoon: {
    label: 'Afternoon',
    timeRange: '12 PM - 6 PM',
    icon: '☀️'
  },
  evening: {
    label: 'Evening',
    timeRange: '6 PM - 12 AM',
    icon: '🌙'
  }
};