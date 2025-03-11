import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import Layout from './Layout';

const Dashboard = () => {
  const { invoices } = useInvoice();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link
            to="/invoices/new"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
            New Invoice
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Invoices</h2>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold p-6 border-b">Recent Invoices</h2>
          <div className="p-6">
            {invoices.length === 0 ? (
              <p className="text-gray-500">No invoices yet</p>
            ) : (
              <div className="space-y-4">
                {invoices.slice(0, 5).map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{invoice.billTo.name}</p>
                      <p className="text-sm text-gray-500">Invoice #{invoice.invoiceNo}</p>
                    </div>
                    <Link
                      to={`/invoices/${invoice.id}`}
                      className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                    >
                      <FileText size={16} />
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;