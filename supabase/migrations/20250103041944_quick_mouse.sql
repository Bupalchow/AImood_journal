/*
  # Fix journal entries RLS policies

  1. Changes
    - Drop existing policies
    - Create new, more specific policies for CRUD operations
    - Add better security checks

  2. Security
    - Ensure users can only:
      - Create entries with their own user_id
      - Read their own entries
      - Update their own entries
      - Delete their own entries
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can create their own entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can read their own entries" ON journal_entries;

-- Create new policies with proper security
CREATE POLICY "Enable read access for users to their own entries"
  ON journal_entries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Enable insert access for authenticated users"
  ON journal_entries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update access for users to their own entries"
  ON journal_entries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete access for users to their own entries"
  ON journal_entries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);