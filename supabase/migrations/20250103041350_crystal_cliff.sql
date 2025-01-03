/*
  # Create journal entries table

  1. New Tables
    - `journal_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `content` (text)
      - `mood` (text)
      - `ai_insights` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `journal_entries` table
    - Add policies for authenticated users to:
      - Create their own entries
      - Read their own entries
*/

CREATE TABLE IF NOT EXISTS journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  content text NOT NULL,
  mood text NOT NULL CHECK (mood IN ('happy', 'neutral', 'sad')),
  ai_insights text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create their own entries"
  ON journal_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read their own entries"
  ON journal_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);