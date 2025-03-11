import React, { createContext, useContext, useState } from 'react';
import { InvoiceData, Customer, CompanySettings } from '../types/invoice';

interface InvoiceContextType {
  invoices: InvoiceData[];
  customers: Customer[];
  companySettings: CompanySettings;
  addInvoice: (invoice: InvoiceData) => void;
  addCustomer: (customer: Customer) => void;
  updateCompanySettings: (settings: CompanySettings) => void;
}

const defaultCompanySettings: CompanySettings = {
  name: 'Techius Solutions',
  address: 'Maliappally, Kerala',
  uamNo: 'KL11D0004260',
  phone: '+91-9981560545',
  website: 'www.techiussolutions.in',
  email: 'info@techiussolutions.in',
  logoUrl: 'https://techiussolutions.in/wp-content/uploads/2023/12/logo.png'
};

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const InvoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [invoices, setInvoices] = useState<InvoiceData[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(defaultCompanySettings);

  const addInvoice = (invoice: InvoiceData) => {
    setInvoices(prev => [...prev, invoice]);
  };

  const addCustomer = (customer: Customer) => {
    setCustomers(prev => [...prev, customer]);
  };

  const updateCompanySettings = (settings: CompanySettings) => {
    setCompanySettings(settings);
  };

  return (
    <InvoiceContext.Provider value={{
      invoices,
      customers,
      companySettings,
      addInvoice,
      addCustomer,
      updateCompanySettings
    }}>
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoice = () => {
  const context = useContext(InvoiceContext);
  if (context === undefined) {
    throw new Error('useInvoice must be used within an InvoiceProvider');
  }
  return context;
};