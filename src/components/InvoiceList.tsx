import React from 'react';
import { useInvoice } from '../context/InvoiceContext';
import Layout from './Layout';
import { Link } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';

const InvoiceList = () => {
  const { invoices } = useInvoice();

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Invoices</h1>
          <Link
            to="/invoices/new"
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            <Plus size={20} />
            New Invoice
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow">
          {invoices.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No invoices yet
            </div>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {invoices.map((invoice) => {
                  const total = invoice.items.reduce((sum, item) => sum + item.amount, 0) - invoice.discount;
                  return (
                    <tr key={invoice.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNo}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.billTo.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.date.toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{total.toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.status === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'sent'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <FileText size={20} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default InvoiceList;