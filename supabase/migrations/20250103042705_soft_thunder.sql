/*
  # Add day section to journal entries

  1. Changes
    - Add day_section column to journal_entries table
    - Update mood check constraint to include all moods
    - Add check constraint for day_section values

  2. Security
    - Existing RLS policies remain unchanged
*/

ALTER TABLE journal_entries 
  ADD COLUMN IF NOT EXISTS day_section text NOT NULL DEFAULT 'morning'
  CHECK (day_section IN ('morning', 'afternoon', 'evening'));

-- Update mood check constraint to include all moods
ALTER TABLE journal_entries 
  DROP CONSTRAINT IF EXISTS journal_entries_mood_check,
  ADD CONSTRAINT journal_entries_mood_check 
    CHECK (mood IN ('excited', 'happy', 'neutral', 'anxious', 'sad'));