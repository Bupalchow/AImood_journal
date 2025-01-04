import { format, startOfMonth, endOfMonth, eachDayOfInterval, isEqual } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { JournalEntry} from '../types';
import { moodConfigs } from '../config/moods';

// Add these helper functions at the top
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return '#' + [r, g, b].map(x => {
    const hex = Math.round(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
};

const getAverageMoodColor = (entries: JournalEntry[]) => {
  if (!entries || entries.length === 0) return '';
  
  const rgbColors = entries.map(entry => hexToRgb(moodConfigs[entry.mood].color)).filter(Boolean);
  
  const avgColor = rgbColors.reduce<{r: number, g: number, b: number}>((acc, color) => ({
    r: acc.r + color!.r / rgbColors.length,
    g: acc.g + color!.g / rgbColors.length,
    b: acc.b + color!.b / rgbColors.length
  }), { r: 0, g: 0, b: 0 });
  
  return rgbToHex(avgColor.r, avgColor.g, avgColor.b);
};

interface Props {
  entries: JournalEntry[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export function CalendarView({ entries, selectedDate, onSelectDate }: Props) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group entries by date
  const entriesByDate = entries.reduce((acc, entry) => {
    const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(entry);
    return acc;
  }, {} as Record<string, JournalEntry[]>);

  // Replace getDayMoodStyle with this simpler version
  const getDayMoodStyle = (entries: JournalEntry[]) => {
    if (!entries || entries.length === 0) return {};
    
    return {
      backgroundColor: getAverageMoodColor(entries)
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold flex items-center gap-2 mb-4">
        <CalendarIcon className="h-5 w-5" />
        {format(now, 'MMMM yyyy')}
      </h3>

      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        
        {days.map(day => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const dayEntries = entriesByDate[dateKey];
          const isSelected = isEqual(day, selectedDate);
          
          return (
            <div
              key={dateKey}
              className="aspect-square p-1 cursor-pointer"
              onClick={() => onSelectDate(day)}
            >
              <div 
                className={`w-full h-full rounded-full flex items-center justify-center text-sm
                  ${dayEntries ? 'text-white' : 'text-gray-700 hover:bg-gray-50'}
                  ${isSelected ? 'ring-2 ring-purple-500 ring-offset-2' : ''}`}
                style={getDayMoodStyle(dayEntries || [])}
                title={dayEntries?.map(e => `${e.day_section}: ${moodConfigs[e.mood].label}`).join('\n')}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}