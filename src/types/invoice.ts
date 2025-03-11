export interface Customer {
  id: string;
  name: string;
  address: string;
  pincode: string;
  email: string;
  phone: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  amount: number;
}

export interface InvoiceData {
  id: string;
  billTo: Customer;
  date: Date;
  invoiceNo: string;
  items: InvoiceItem[];
  discount: number;
  paymentDetails: {
    accountHolder: string;
    bankName: string;
    accountNumber: string;
    ifsc: string;
    branch: string;
  };
  status: 'draft' | 'sent' | 'paid';
  createdAt: Date;
}

export interface CompanySettings {
  name: string;
  address: string;
  uamNo: string;
  phone: string;
  website: string;
  email: string;
  logoUrl: string;
}