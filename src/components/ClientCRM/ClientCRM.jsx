import React, { useState, useEffect } from 'react';
import { clientService } from '../../firebase/services';
import './ClientCRM.css';

const ClientCRM = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    project: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = clients.filter(client =>
        client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.project?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredClients(filtered);
    } else {
      setFilteredClients(clients);
    }
  }, [searchTerm, clients]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const data = await clientService.getAllClients();
      setClients(data);
      setFilteredClients(data);
    } catch (error) {
      alert('Error loading clients: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingClient) {
        await clientService.updateClient(editingClient.id, formData);
        alert('Client updated successfully!');
      } else {
        await clientService.createClient(formData);
        alert('Client created successfully!');
      }
      resetForm();
      loadClients();
    } catch (error) {
      alert('Error saving client: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      company: client.company,
      phone: client.phone,
      project: client.project,
      status: client.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      setLoading(true);
      try {
        await clientService.deleteClient(id);
        alert('Client deleted successfully!');
        loadClients();
      } catch (error) {
        alert('Error deleting client: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      company: '',
      phone: '',
      project: '',
      status: 'active'
    });
    setEditingClient(null);
    setShowForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'inactive': return '#9E9E9E';
      case 'pending': return '#FF9800';
      default: return '#2196F3';
    }
  };

  return (
    <div className="client-crm">
      <div className="crm-header">
        <h1>Client & CRM Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add New Client'}
        </button>
      </div>

      {showForm && (
        <div className="client-form-container">
          <h2>{editingClient ? 'Edit Client' : 'Add New Client'}</h2>
          <form onSubmit={handleSubmit} className="client-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Project</label>
                <input
                  type="text"
                  value={formData.project}
                  onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingClient ? 'Update Client' : 'Create Client'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search clients by name, email, company, or project..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading && <div className="loading">Loading...</div>}

      <div className="clients-grid">
        {filteredClients.map((client) => (
          <div key={client.id} className="client-card">
            <div className="client-header">
              <h3>{client.name}</h3>
              <span
                className="status-badge"
                style={{ backgroundColor: getStatusColor(client.status) }}
              >
                {client.status}
              </span>
            </div>
            <div className="client-info">
              <p><strong>Email:</strong> {client.email}</p>
              {client.company && <p><strong>Company:</strong> {client.company}</p>}
              {client.phone && <p><strong>Phone:</strong> {client.phone}</p>}
              {client.project && <p><strong>Project:</strong> {client.project}</p>}
            </div>
            <div className="client-actions">
              <button className="btn-edit" onClick={() => handleEdit(client)}>
                Edit
              </button>
              <button className="btn-delete" onClick={() => handleDelete(client.id)}>
                Delete
              </button>
              <button className="btn-invoice">
                Generate Invoice
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredClients.length === 0 && !loading && (
        <div className="empty-state">
          <p>No clients found. {searchTerm ? 'Try a different search.' : 'Add your first client!'}</p>
        </div>
      )}
    </div>
  );
};

export default ClientCRM;
