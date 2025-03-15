import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PDFViewer } from '@react-pdf/renderer';
import { FileText, ArrowLeft, Edit, Trash2, Send } from 'lucide-react';
import Layout from './Layout';
import InvoicePDF from './InvoicePDF';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface Invoice {
  id: string;
  invoice_number: string;
  date: string;
  due_date: string | null;
  client_id: string;
  subtotal: number;
  discount: number;
  total: number;
  notes: string | null;
  terms: string | null;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
  client: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }[];
}

const ViewInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      if (!user) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      if (!id) {
        setError('Invalid invoice ID');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchError } = await supabase
          .from('invoices')
          .select(`
            *,
            client:clients(name, email, phone, address),
            items:invoice_items(*)
          `)
          .eq('id', id)
          .eq('user_id', user.id)
          .single();

        if (fetchError) throw fetchError;

        if (!data) {
          setError('Invoice not found');
          setLoading(false);
          return;
        }

        setInvoice(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching invoice:', err);
        setError('Failed to load invoice');
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id, user]);

  const handleStatusUpdate = async (newStatus: 'draft' | 'sent' | 'paid') => {
    if (!user || !id || !invoice) return;

    try {
      const { error: updateError } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id)
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      setInvoice({ ...invoice, status: newStatus });
      toast.success(`Invoice marked as ${newStatus}`);
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast.error('Failed to update invoice status');
    }
  };

  const handleDelete = async () => {
    if (!user || !id) return;
    
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const { error: deleteError } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      toast.success('Invoice deleted successfully');
      navigate('/invoices');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast.error('Failed to delete invoice');
    }
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

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-gray-500 mb-4">{error}</p>
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Invoices
          </button>
        </div>
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Invoice not found</p>
          <button
            onClick={() => navigate('/invoices')}
            className="mt-4 flex items-center text-blue-500 hover:text-blue-600 mx-auto"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Invoices
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/invoices')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Invoices
          </button>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowPDF(!showPDF)}
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <FileText className="w-5 h-5 mr-2" />
              {showPDF ? 'Hide PDF' : 'Show PDF'}
            </button>
            {invoice.status === 'draft' && (
              <button
                onClick={() => handleStatusUpdate('sent')}
                className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
              >
                <Send className="w-5 h-5 mr-2" />
                Mark as Sent
              </button>
            )}
            {invoice.status === 'sent' && (
              <button
                onClick={() => handleStatusUpdate('paid')}
                className="flex items-center px-4 py-2 text-green-600 hover:text-green-700"
              >
                <FileText className="w-5 h-5 mr-2" />
                Mark as Paid
              </button>
            )}
            <button
              onClick={() => navigate(`/invoices/${id}/edit`)}
              className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Delete
            </button>
          </div>
        </div>

        {showPDF ? (
          <div className="h-screen">
            <PDFViewer style={{ width: '100%', height: '100%' }}>
              <InvoicePDF data={{
                id: invoice.id,
                invoice_number: invoice.invoice_number,
                date: invoice.date,
                client: invoice.client,
                items: invoice.items.map(item => ({
                  description: item.description,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  total: item.total
                })),
                discount: invoice.discount,
                subtotal: invoice.subtotal,
                total: invoice.total,
                notes: invoice.notes || '',
                terms: invoice.terms || '',
                status: invoice.status
              }} />
            </PDFViewer>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Client Information</h3>
                <p className="text-gray-600">{invoice.client.name}</p>
                <p className="text-gray-600">{invoice.client.email}</p>
                <p className="text-gray-600">{invoice.client.phone}</p>
                <p className="text-gray-600">{invoice.client.address}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Invoice Details</h3>
                <p className="text-gray-600">Invoice #: {invoice.invoice_number}</p>
                <p className="text-gray-600">Date: {new Date(invoice.date).toLocaleDateString()}</p>
                {invoice.due_date && (
                  <p className="text-gray-600">Due Date: {new Date(invoice.due_date).toLocaleDateString()}</p>
                )}
                <p className="text-gray-600">
                  Status: 
                  <span className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    invoice.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : invoice.status === 'sent'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Items</h3>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Description</th>
                    <th className="text-right py-2">Quantity</th>
                    <th className="text-right py-2">Unit Price</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">{item.description}</td>
                      <td className="text-right py-2">{item.quantity}</td>
                      <td className="text-right py-2">₹{item.unit_price.toLocaleString()}</td>
                      <td className="text-right py-2">₹{item.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-semibold">Subtotal:</td>
                    <td className="text-right py-2">₹{invoice.subtotal.toLocaleString()}</td>
                  </tr>
                  {invoice.discount > 0 && (
                    <tr>
                      <td colSpan={3} className="text-right py-2 font-semibold">Discount:</td>
                      <td className="text-right py-2">₹{invoice.discount.toLocaleString()}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} className="text-right py-2 font-semibold">Total:</td>
                    <td className="text-right py-2 font-semibold">₹{invoice.total.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {(invoice.notes || invoice.terms) && (
              <div className="mt-8 space-y-4">
                {invoice.notes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Notes</h3>
                    <p className="text-gray-600">{invoice.notes}</p>
                  </div>
                )}
                {invoice.terms && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Terms</h3>
                    <p className="text-gray-600">{invoice.terms}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ViewInvoice;