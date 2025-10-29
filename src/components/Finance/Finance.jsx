import React, { useState, useEffect } from 'react';
import { financeService } from '../../firebase/services';
import './Finance.css';

const Finance = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [invoices, setInvoices] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  
  const [invoiceForm, setInvoiceForm] = useState({
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
    tax: 0,
    notes: '',
    dueDate: ''
  });

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadDashboard();
    } else if (activeTab === 'invoices') {
      loadInvoices();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    setLoading(true);
    try {
      const data = await financeService.getBillingDashboard();
      setDashboardData(data);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      alert('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const loadInvoices = async () => {
    setLoading(true);
    try {
      const data = await financeService.getAllInvoices();
      setInvoices(data);
    } catch (error) {
      console.error('Error loading invoices:', error);
      alert('Failed to load invoices');
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceFormChange = (e) => {
    const { name, value } = e.target;
    setInvoiceForm(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...invoiceForm.items];
    newItems[index][field] = value;
    
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = newItems[index].quantity * newItems[index].rate;
    }
    
    setInvoiceForm(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setInvoiceForm(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    }));
  };

  const removeItem = (index) => {
    setInvoiceForm(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateTotals = () => {
    const subtotal = invoiceForm.items.reduce((sum, item) => sum + item.amount, 0);
    const taxAmount = (subtotal * invoiceForm.tax) / 100;
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
  };

  const handleSubmitInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { subtotal, total } = calculateTotals();
      const invoiceData = {
        ...invoiceForm,
        subtotal,
        total,
        status: 'pending'
      };
      
      await financeService.generateInvoice(invoiceData);
      alert('Invoice generated successfully!');
      setShowInvoiceForm(false);
      setInvoiceForm({
        clientId: '',
        clientName: '',
        clientEmail: '',
        clientCompany: '',
        items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
        tax: 0,
        notes: '',
        dueDate: ''
      });
      loadInvoices();
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('Failed to generate invoice');
    } finally {
      setLoading(false);
    }
  };

  const updateInvoiceStatus = async (id, status) => {
    try {
      await financeService.updateInvoiceStatus(id, status);
      alert('Invoice status updated!');
      loadInvoices();
      if (activeTab === 'dashboard') loadDashboard();
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Failed to update invoice');
    }
  };

  return (
    <div className="finance-container">
      <div className="finance-header">
        <h1>💰 Finance Management</h1>
        <div className="finance-tabs">
          <button
            className={activeTab === 'dashboard' ? 'active' : ''}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={activeTab === 'invoices' ? 'active' : ''}
            onClick={() => setActiveTab('invoices')}
          >
            Invoices
          </button>
          <button
            className={activeTab === 'salary' ? 'active' : ''}
            onClick={() => setActiveTab('salary')}
          >
            Salary
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Billing Dashboard */}
      {activeTab === 'dashboard' && dashboardData && (
        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card revenue">
              <h3>Total Revenue</h3>
              <p className="stat-value">${dashboardData.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="stat-card pending">
              <h3>Pending Amount</h3>
              <p className="stat-value">${dashboardData.pendingAmount.toFixed(2)}</p>
            </div>
            <div className="stat-card invoices">
              <h3>Total Invoices</h3>
              <p className="stat-value">{dashboardData.totalInvoices}</p>
            </div>
            <div className="stat-card overdue">
              <h3>Overdue Invoices</h3>
              <p className="stat-value">{dashboardData.overdueInvoices}</p>
            </div>
          </div>

          <div className="recent-invoices">
            <h2>Recent Invoices</h2>
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentInvoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.clientName}</td>
                    <td>${invoice.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>{invoice.dueDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices Management */}
      {activeTab === 'invoices' && (
        <div className="invoices-content">
          <div className="invoices-header">
            <h2>Invoice Management</h2>
            <button
              className="btn-primary"
              onClick={() => setShowInvoiceForm(!showInvoiceForm)}
            >
              {showInvoiceForm ? 'Cancel' : '+ Generate Invoice'}
            </button>
          </div>

          {showInvoiceForm && (
            <form onSubmit={handleSubmitInvoice} className="invoice-form">
              <h3>New Invoice</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={invoiceForm.clientName}
                    onChange={handleInvoiceFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Client Email</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={invoiceForm.clientEmail}
                    onChange={handleInvoiceFormChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Company</label>
                  <input
                    type="text"
                    name="clientCompany"
                    value={invoiceForm.clientCompany}
                    onChange={handleInvoiceFormChange}
                  />
                </div>
                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={invoiceForm.dueDate}
                    onChange={handleInvoiceFormChange}
                    required
                  />
                </div>
              </div>

              <div className="invoice-items">
                <h4>Items</h4>
                {invoiceForm.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={item.rate}
                      onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                      required
                    />
                    <span className="item-amount">${item.amount.toFixed(2)}</span>
                    {invoiceForm.items.length > 1 && (
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeItem(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addItem}>
                  + Add Item
                </button>
              </div>

              <div className="form-group">
                <label>Tax (%)</label>
                <input
                  type="number"
                  name="tax"
                  value={invoiceForm.tax}
                  onChange={handleInvoiceFormChange}
                  min="0"
                  max="100"
                  step="0.01"
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={invoiceForm.notes}
                  onChange={handleInvoiceFormChange}
                  rows="3"
                />
              </div>

              <div className="invoice-totals">
                <div>Subtotal: ${calculateTotals().subtotal.toFixed(2)}</div>
                <div>Tax: ${calculateTotals().taxAmount.toFixed(2)}</div>
                <div className="total">Total: ${calculateTotals().total.toFixed(2)}</div>
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Invoice'}
              </button>
            </form>
          )}

          <div className="invoices-list">
            <table>
              <thead>
                <tr>
                  <th>Invoice #</th>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(invoice => (
                  <tr key={invoice.id}>
                    <td>{invoice.invoiceNumber}</td>
                    <td>{invoice.clientName}</td>
                    <td>{invoice.clientCompany}</td>
                    <td>${invoice.total.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td>{invoice.dueDate}</td>
                    <td>
                      {invoice.status === 'pending' && (
                        <button
                          className="btn-small"
                          onClick={() => updateInvoiceStatus(invoice.id, 'paid')}
                        >
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Management */}
      {activeTab === 'salary' && (
        <div className="salary-content">
          <h2>Salary Allocation System</h2>
          <p>Salary calculation based on task logs coming soon...</p>
        </div>
      )}
    </div>
  );
};

export default Finance;
