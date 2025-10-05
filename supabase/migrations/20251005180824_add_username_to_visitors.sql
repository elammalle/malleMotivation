/*
  # Add username field to visitors table

  1. Changes
    - Add `username` column to visitors table to store user identification
    - Column allows NULL values for existing records
    - Default value is empty string for new records
  
  2. Security
    - No changes to RLS policies needed
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'visitors' AND column_name = 'username'
  ) THEN
    ALTER TABLE visitors ADD COLUMN username text DEFAULT '';
  END IF;
END $$;
