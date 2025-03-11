/*
  # Initial Schema Setup for Invoice System

  1. New Tables
    - clients
      - id (uuid, primary key)
      - name (text)
      - email (text)
      - phone (text)
      - address (text)
      - created_at (timestamptz)
      - user_id (uuid, foreign key to auth.users)

    - invoices
      - id (uuid, primary key)
      - invoice_number (text)
      - date (date)
      - due_date (date)
      - client_id (uuid, foreign key to clients)
      - subtotal (numeric)
      - tax_rate (numeric)
      - tax_amount (numeric)
      - discount (numeric)
      - total (numeric)
      - notes (text)
      - terms (text)
      - status (text)
      - created_at (timestamptz)
      - user_id (uuid, foreign key to auth.users)

    - invoice_items
      - id (uuid, primary key)
      - invoice_id (uuid, foreign key to invoices)
      - description (text)
      - quantity (numeric)
      - unit_price (numeric)
      - tax_rate (numeric)
      - tax_amount (numeric)
      - total (numeric)

    - company_settings
      - id (uuid, primary key)
      - user_id (uuid, foreign key to auth.users)
      - name (text)
      - logo_url (text)
      - address (text)
      - phone (text)
      - email (text)
      - website (text)
      - tax_number (text)
      - default_tax_rate (numeric)
      - default_currency (text)
      - invoice_notes (text)
      - invoice_terms (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create clients table
CREATE TABLE clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text,
  phone text,
  address text,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own clients"
  ON clients
  USING (auth.uid() = user_id);

-- Create invoices table
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  due_date date,
  client_id uuid REFERENCES clients(id) NOT NULL,
  subtotal numeric NOT NULL DEFAULT 0,
  tax_rate numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  discount numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  notes text,
  terms text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own invoices"
  ON invoices
  USING (auth.uid() = user_id);

-- Create invoice_items table
CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES invoices(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  tax_rate numeric DEFAULT 0,
  tax_amount numeric DEFAULT 0,
  total numeric NOT NULL DEFAULT 0
);

ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage invoice items through parent invoice"
  ON invoice_items
  USING (EXISTS (
    SELECT 1 FROM invoices
    WHERE invoices.id = invoice_items.invoice_id
    AND invoices.user_id = auth.uid()
  ));

-- Create company_settings table
CREATE TABLE company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL UNIQUE,
  name text NOT NULL,
  logo_url text,
  address text,
  phone text,
  email text,
  website text,
  tax_number text,
  default_tax_rate numeric DEFAULT 0,
  default_currency text DEFAULT 'INR',
  invoice_notes text,
  invoice_terms text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own company settings"
  ON company_settings
  USING (auth.uid() = user_id);