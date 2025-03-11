import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { InvoiceProvider } from './context/InvoiceContext';
import Dashboard from './components/Dashboard';
import CreateInvoice from './components/CreateInvoice';
import ViewInvoice from './components/ViewInvoice';
import CustomerList from './components/CustomerList';
import InvoiceList from './components/InvoiceList';
import Settings from './components/Settings';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <InvoiceProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/invoices/new" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
              <Route path="/invoices/:id" element={<PrivateRoute><ViewInvoice /></PrivateRoute>} />
              <Route path="/invoices" element={<PrivateRoute><InvoiceList /></PrivateRoute>} />
              <Route path="/customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </InvoiceProvider>
    </AuthProvider>
  );
}

export default App;