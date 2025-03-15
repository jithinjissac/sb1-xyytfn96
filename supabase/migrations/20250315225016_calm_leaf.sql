/*
  # Add currency settings to company_settings table

  1. Changes
    - Add default_currency column to company_settings table
    - Set default currency to INR
    - Add check constraint for valid currencies

  2. Security
    - Maintain existing RLS policies
*/

-- Add currency column with check constraint
ALTER TABLE company_settings
ADD COLUMN IF NOT EXISTS default_currency text DEFAULT 'INR'::text,
ADD CONSTRAINT valid_currency CHECK (default_currency IN ('INR', 'USD', 'GBP', 'AUD'));