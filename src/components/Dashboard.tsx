import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import Layout from './Layout';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  client: {
    name: string;
  };
  total: number;
  status: 'draft' | 'sent' | 'paid';
}

const Dashboard = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('invoices')
          .select(`
            id,
            invoice_number,
            date,
            total,
            status,
            client:clients(name)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setInvoices(data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, [user]);

  const getTotalAmount = () => {
    return invoices.reduce((sum, invoice) => sum + invoice.total, 0);
  };

  const getStatusCount = (status: 'draft' | 'sent' | 'paid') => {
    return invoices.filter(invoice => invoice.status === status).length;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Invoices</h2>
            <p className="text-3xl font-bold">{invoices.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Total Amount</h2>
            <p className="text-3xl font-bold">₹{getTotalAmount().toLocaleString()}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Pending Invoices</h2>
            <p className="text-3xl font-bold">{getStatusCount('sent')}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-2">Paid Invoices</h2>
            <p className="text-3xl font-bold">{getStatusCount('paid')}</p>
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
                  <div key={invoice.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{invoice.client?.name || 'Unnamed Client'}</p>
                      <p className="text-sm text-gray-500">Invoice #{invoice.invoice_number}</p>
                      <p className="text-sm text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{invoice.total.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'sent'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                      <Link
                        to={`/invoices/${invoice.id}`}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 mt-2 justify-end"
                      >
                        <FileText size={16} />
                        View
                      </Link>
                    </div>
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