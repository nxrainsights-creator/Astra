import React, { useState, useEffect } from 'react';
import { invoiceService, clientService, projectService } from '../../firebase/services';
import jsPDF from 'jspdf';
import './Finance.css';

const Finance = () => {
  const [invoices, setInvoices] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [invoiceFormData, setInvoiceFormData] = useState({
    clientId: '',
    projectId: '',
    invoiceNumber: '',
    amount: '',
    tax: 18,
    description: '',
    paymentStatus: 'pending',
    dueDate: '',
    items: []
  });

  const [lineItem, setLineItem] = useState({
    description: '',
    quantity: 1,
    unitPrice: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [invoicesData, clientsData, projectsData] = await Promise.all([
        invoiceService.getAllInvoices(),
        clientService.getAllClients(),
        projectService.getAllProjects()
      ]);
      setInvoices(invoicesData);
      setClients(clientsData);
      setProjects(projectsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `INV-${year}${month}-${random}`;
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const invoiceData = {
        ...invoiceFormData,
        invoiceNumber: invoiceFormData.invoiceNumber || generateInvoiceNumber(),
        items: invoiceFormData.items.length > 0 ? invoiceFormData.items : [],
        subtotal: calculateSubtotal(),
        total: calculateTotal()
      };

      if (editingInvoice) {
        await invoiceService.updateInvoice(editingInvoice.id, invoiceData);
        alert('Invoice updated successfully!');
      } else {
        await invoiceService.createInvoice(invoiceData);
        alert('Invoice created successfully!');
      }
      
      setShowInvoiceForm(false);
      resetForm();
      loadData();
    } catch (error) {
      alert('Error saving invoice: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceFormData({
      clientId: invoice.clientId,
      projectId: invoice.projectId,
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.amount,
      tax: invoice.tax || 18,
      description: invoice.description || '',
      paymentStatus: invoice.paymentStatus,
      dueDate: invoice.dueDate || '',
      items: invoice.items || []
    });
    setShowInvoiceForm(true);
  };

  const handleDeleteInvoice = async (invoiceId) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    
    setLoading(true);
    try {
      await invoiceService.deleteInvoice(invoiceId);
      alert('Invoice deleted successfully!');
      loadData();
    } catch (error) {
      alert('Error deleting invoice: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const addLineItem = () => {
    if (!lineItem.description || lineItem.quantity <= 0 || lineItem.unitPrice <= 0) {
      alert('Please fill all line item fields correctly');
      return;
    }

    const newItem = {
      ...lineItem,
      total: lineItem.quantity * lineItem.unitPrice
    };

    setInvoiceFormData({
      ...invoiceFormData,
      items: [...invoiceFormData.items, newItem]
    });

    setLineItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const removeLineItem = (index) => {
    const newItems = invoiceFormData.items.filter((_, i) => i !== index);
    setInvoiceFormData({ ...invoiceFormData, items: newItems });
  };

  const calculateSubtotal = () => {
    if (invoiceFormData.items.length > 0) {
      return invoiceFormData.items.reduce((sum, item) => sum + item.total, 0);
    }
    return parseFloat(invoiceFormData.amount) || 0;
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const taxAmount = subtotal * (parseFloat(invoiceFormData.tax) / 100);
    return subtotal + taxAmount;
  };

  const generatePDF = (invoice) => {
    const doc = new jsPDF();
    const client = clients.find(c => c.id === invoice.clientId);
    const project = projects.find(p => p.id === invoice.projectId);

    // Header
    doc.setFillColor(102, 126, 234);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('NXRA INSIGHTS', 20, 25);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Internal Management Portal', 20, 32);

    // Invoice Details
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', 150, 25);
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(`Invoice #: ${invoice.invoiceNumber}`, 150, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 38);

    // Client Information
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('Bill To:', 20, 55);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(client?.name || 'Unknown Client', 20, 62);
    doc.text(client?.company || '', 20, 68);
    doc.text(client?.email || '', 20, 74);
    doc.text(client?.phone || '', 20, 80);

    // Project Information
    if (project) {
      doc.setFont(undefined, 'bold');
      doc.text('Project:', 120, 55);
      doc.setFont(undefined, 'normal');
      doc.text(project.name, 120, 62);
    }

    // Line Items Table
    let yPosition = 100;
    doc.setFont(undefined, 'bold');
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPosition, 170, 10, 'F');
    doc.text('Description', 25, yPosition + 7);
    doc.text('Qty', 120, yPosition + 7);
    doc.text('Unit Price', 140, yPosition + 7);
    doc.text('Total', 170, yPosition + 7);

    yPosition += 15;
    doc.setFont(undefined, 'normal');

    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item) => {
        doc.text(item.description, 25, yPosition);
        doc.text(item.quantity.toString(), 120, yPosition);
        doc.text(`₹${item.unitPrice.toFixed(2)}`, 140, yPosition);
        doc.text(`₹${item.total.toFixed(2)}`, 170, yPosition);
        yPosition += 8;
      });
    } else {
      doc.text(invoice.description || 'Service Provided', 25, yPosition);
      doc.text('1', 120, yPosition);
      doc.text(`₹${parseFloat(invoice.amount || 0).toFixed(2)}`, 140, yPosition);
      doc.text(`₹${parseFloat(invoice.amount || 0).toFixed(2)}`, 170, yPosition);
      yPosition += 8;
    }

    // Totals
    yPosition += 10;
    doc.setDrawColor(200, 200, 200);
    doc.line(20, yPosition, 190, yPosition);
    yPosition += 10;

    const subtotal = invoice.subtotal || parseFloat(invoice.amount) || 0;
    const taxRate = invoice.tax || 18;
    const taxAmount = subtotal * (taxRate / 100);
    const total = invoice.total || (subtotal + taxAmount);

    doc.text('Subtotal:', 140, yPosition);
    doc.text(`₹${subtotal.toFixed(2)}`, 170, yPosition);
    yPosition += 7;

    doc.text(`Tax (${taxRate}%):`, 140, yPosition);
    doc.text(`₹${taxAmount.toFixed(2)}`, 170, yPosition);
    yPosition += 10;

    doc.setFont(undefined, 'bold');
    doc.setFontSize(12);
    doc.text('Total:', 140, yPosition);
    doc.text(`₹${total.toFixed(2)}`, 170, yPosition);

    // Payment Status
    yPosition += 15;
    doc.setFontSize(10);
    doc.text('Payment Status:', 20, yPosition);
    const statusColor = invoice.paymentStatus === 'paid' ? [76, 175, 80] : 
                       invoice.paymentStatus === 'overdue' ? [244, 67, 54] : [255, 152, 0];
    doc.setTextColor(...statusColor);
    doc.setFont(undefined, 'bold');
    doc.text(invoice.paymentStatus.toUpperCase(), 55, yPosition);

    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('Thank you for your business!', 105, 270, { align: 'center' });
    doc.text('NXRA Insights - Internal Management System', 105, 277, { align: 'center' });

    // Save PDF
    doc.save(`Invoice_${invoice.invoiceNumber}.pdf`);
  };

  const resetForm = () => {
    setInvoiceFormData({
      clientId: '',
      projectId: '',
      invoiceNumber: '',
      amount: '',
      tax: 18,
      description: '',
      paymentStatus: 'pending',
      dueDate: '',
      items: []
    });
    setEditingInvoice(null);
  };

  const getClientName = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown Client';
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'N/A';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid': return '#4CAF50';
      case 'overdue': return '#f44336';
      case 'pending': return '#FF9800';
      default: return '#757575';
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesStatus = filterStatus === 'all' || invoice.paymentStatus === filterStatus;
    const matchesSearch = searchTerm === '' || 
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getClientName(invoice.clientId).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
  const paidAmount = invoices.filter(inv => inv.paymentStatus === 'paid').reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
  const pendingAmount = invoices.filter(inv => inv.paymentStatus === 'pending').reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);
  const overdueAmount = invoices.filter(inv => inv.paymentStatus === 'overdue').reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0);

  return (
    <div className="finance">
      <div className="finance-header">
        <h1>Finance & Invoicing</h1>
        <button className="btn-primary" onClick={() => setShowInvoiceForm(!showInvoiceForm)}>
          {showInvoiceForm ? 'Cancel' : '+ Create Invoice'}
        </button>
      </div>

      {/* Finance Stats */}
      <div className="finance-stats">
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p className="stat-value">₹{totalRevenue.toFixed(2)}</p>
        </div>
        <div className="stat-card stat-success">
          <h3>Paid</h3>
          <p className="stat-value">₹{paidAmount.toFixed(2)}</p>
          <span className="stat-count">{invoices.filter(i => i.paymentStatus === 'paid').length} invoices</span>
        </div>
        <div className="stat-card stat-warning">
          <h3>Pending</h3>
          <p className="stat-value">₹{pendingAmount.toFixed(2)}</p>
          <span className="stat-count">{invoices.filter(i => i.paymentStatus === 'pending').length} invoices</span>
        </div>
        <div className="stat-card stat-danger">
          <h3>Overdue</h3>
          <p className="stat-value">₹{overdueAmount.toFixed(2)}</p>
          <span className="stat-count">{invoices.filter(i => i.paymentStatus === 'overdue').length} invoices</span>
        </div>
      </div>

      {/* Invoice Form */}
      {showInvoiceForm && (
        <div className="invoice-form-container">
          <h2>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
          <form onSubmit={handleCreateInvoice} className="invoice-form">
            <div className="form-row">
              <div className="form-group">
                <label>Invoice Number</label>
                <input
                  type="text"
                  value={invoiceFormData.invoiceNumber}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, invoiceNumber: e.target.value })}
                  placeholder="Auto-generated if empty"
                />
              </div>
              <div className="form-group">
                <label>Client *</label>
                <select
                  required
                  value={invoiceFormData.clientId}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, clientId: e.target.value })}
                >
                  <option value="">Select client</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Project</label>
                <select
                  value={invoiceFormData.projectId}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, projectId: e.target.value })}
                >
                  <option value="">Select project (optional)</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={invoiceFormData.dueDate}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, dueDate: e.target.value })}
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="line-items-section">
              <h3>Line Items</h3>
              <div className="line-item-input">
                <input
                  type="text"
                  placeholder="Description"
                  value={lineItem.description}
                  onChange={(e) => setLineItem({ ...lineItem, description: e.target.value })}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={lineItem.quantity}
                  onChange={(e) => setLineItem({ ...lineItem, quantity: parseInt(e.target.value) || 1 })}
                />
                <input
                  type="number"
                  placeholder="Unit Price"
                  min="0"
                  step="0.01"
                  value={lineItem.unitPrice}
                  onChange={(e) => setLineItem({ ...lineItem, unitPrice: parseFloat(e.target.value) || 0 })}
                />
                <button type="button" className="btn-add-item" onClick={addLineItem}>+ Add</button>
              </div>

              {invoiceFormData.items.length > 0 && (
                <div className="line-items-list">
                  {invoiceFormData.items.map((item, index) => (
                    <div key={index} className="line-item">
                      <span>{item.description}</span>
                      <span>{item.quantity} x ₹{item.unitPrice}</span>
                      <span className="item-total">₹{item.total.toFixed(2)}</span>
                      <button type="button" onClick={() => removeLineItem(index)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              {invoiceFormData.items.length === 0 && (
                <div className="form-group">
                  <label>Total Amount (if not using line items) *</label>
                  <input
                    type="number"
                    required={invoiceFormData.items.length === 0}
                    min="0"
                    step="0.01"
                    value={invoiceFormData.amount}
                    onChange={(e) => setInvoiceFormData({ ...invoiceFormData, amount: e.target.value })}
                    placeholder="Enter amount"
                  />
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tax Rate (%)</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={invoiceFormData.tax}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, tax: parseFloat(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select
                  value={invoiceFormData.paymentStatus}
                  onChange={(e) => setInvoiceFormData({ ...invoiceFormData, paymentStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="2"
                value={invoiceFormData.description}
                onChange={(e) => setInvoiceFormData({ ...invoiceFormData, description: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>

            {/* Invoice Summary */}
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>₹{calculateSubtotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Tax ({invoiceFormData.tax}%):</span>
                <span>₹{(calculateSubtotal() * (invoiceFormData.tax / 100)).toFixed(2)}</span>
              </div>
              <div className="summary-row summary-total">
                <span>Total:</span>
                <span>₹{calculateTotal().toFixed(2)}</span>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => { setShowInvoiceForm(false); resetForm(); }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="invoice-filters">
        <input
          type="text"
          className="search-input"
          placeholder="Search invoices..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>

      {loading && <div className="loading">Loading invoices...</div>}

      {/* Invoice List */}
      <div className="invoices-grid">
        {filteredInvoices.map((invoice) => (
          <div key={invoice.id} className="invoice-card">
            <div className="invoice-card-header">
              <h3>{invoice.invoiceNumber}</h3>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusColor(invoice.paymentStatus) }}
              >
                {invoice.paymentStatus}
              </span>
            </div>

            <div className="invoice-info">
              <p><strong>Client:</strong> {getClientName(invoice.clientId)}</p>
              <p><strong>Project:</strong> {getProjectName(invoice.projectId)}</p>
              <p className="invoice-amount">
                <strong>Amount:</strong> ₹{(invoice.total || invoice.amount || 0).toFixed(2)}
              </p>
              {invoice.dueDate && (
                <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
              )}
            </div>

            <div className="invoice-actions">
              <button className="btn-pdf" onClick={() => generatePDF(invoice)}>
                📄 PDF
              </button>
              <button className="btn-edit" onClick={() => handleEditInvoice(invoice)}>
                ✏️ Edit
              </button>
              <button className="btn-delete" onClick={() => handleDeleteInvoice(invoice.id)}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredInvoices.length === 0 && !loading && (
        <div className="empty-state">
          <p>No invoices found. Create your first invoice!</p>
        </div>
      )}
    </div>
  );
};

export default Finance;
