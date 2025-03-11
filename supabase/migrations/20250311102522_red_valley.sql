/*
  # Update invoice schema

  1. Changes
    - Remove tax_rate and tax_amount from invoice_items table
    - Remove tax_rate and tax_amount from invoices table
    - Update invoice_items to include quantity and unit_price
    - Add cascade delete for invoice items

  2. Security
    - Maintain existing RLS policies
*/

-- Remove tax columns from invoice_items
ALTER TABLE invoice_items DROP COLUMN IF EXISTS tax_rate;
ALTER TABLE invoice_items DROP COLUMN IF EXISTS tax_amount;

-- Remove tax columns from invoices
ALTER TABLE invoices DROP COLUMN IF EXISTS tax_rate;
ALTER TABLE invoices DROP COLUMN IF EXISTS tax_amount;

-- Add ON DELETE CASCADE to invoice_items foreign key
ALTER TABLE invoice_items
DROP CONSTRAINT IF EXISTS invoice_items_invoice_id_fkey,
ADD CONSTRAINT invoice_items_invoice_id_fkey
  FOREIGN KEY (invoice_id)
  REFERENCES invoices(id)
  ON DELETE CASCADE;