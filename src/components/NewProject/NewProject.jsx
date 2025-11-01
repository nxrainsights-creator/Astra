import React, { useState, useEffect } from 'react';
import { clientService, userService } from '../../firebase/services';
import './NewProject.css';

const NewProject = ({ onClose, onSuccess, currentUser }) => {
  const [formData, setFormData] = useState({
    // Client Info
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    company: '',
    
    // Project Info
    projectName: '',
    projectDescription: '',
    domain: '',
    startDate: '',
    dueDate: '',
    budget: '',
    
    // Payment Info
    paymentAmount: '',
    paymentStatus: 'pending',
    
    // Assignment
    assignedMembers: [],
    createdBy: currentUser?.uid || ''
  });

  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const users = await userService.getAllUsers();
      setTeamMembers(users);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await clientService.createProject(formData);
      
      if (result.success) {
        alert(result.message);
        onSuccess();
        onClose();
      }
    } catch (error) {
      setError(error.message || 'Error creating project');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberToggle = (memberId) => {
    setFormData(prev => ({
      ...prev,
      assignedMembers: prev.assignedMembers.includes(memberId)
        ? prev.assignedMembers.filter(id => id !== memberId)
        : [...prev.assignedMembers, memberId]
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>➕ Add New Project</h2>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="new-project-form">
          {/* Client Information */}
          <div className="form-section">
            <h3>👤 Client Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Enter client name"
                />
              </div>
              <div className="form-group">
                <label>Client Email *</label>
                <input
                  type="email"
                  required
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.clientPhone}
                  onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  placeholder="+91 1234567890"
                />
              </div>
              <div className="form-group">
                <label>Company</label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  placeholder="Company name"
                />
              </div>
            </div>
          </div>

          {/* Project Information */}
          <div className="form-section">
            <h3>📊 Project Information</h3>
            <div className="form-group">
              <label>Project Name *</label>
              <input
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                rows="3"
                value={formData.projectDescription}
                onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                placeholder="Describe the project..."
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Domain/Category</label>
                <select
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                >
                  <option value="">Select domain</option>
                  <option value="web-development">Web Development</option>
                  <option value="mobile-app">Mobile App</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="consulting">Consulting</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget (₹)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  placeholder="50000"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Due Date *</label>
                <input
                  type="date"
                  required
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="form-section">
            <h3>💰 Payment Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Payment Amount (₹)</label>
                <input
                  type="number"
                  value={formData.paymentAmount}
                  onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
                  placeholder="50000"
                />
              </div>
              <div className="form-group">
                <label>Payment Status</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          </div>

          {/* Team Assignment */}
          <div className="form-section">
            <h3>👥 Assign Team Members</h3>
            <p className="section-hint">Select team members who will work on this project. Tasks will be automatically created for them.</p>
            <div className="team-members-grid">
              {teamMembers.map((member) => (
                <label key={member.id} className="member-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.assignedMembers.includes(member.id)}
                    onChange={() => handleMemberToggle(member.id)}
                  />
                  <div className="member-info">
                    <span className="member-name">{member.name}</span>
                    <span className="member-role">{member.role}</span>
                  </div>
                </label>
              ))}
            </div>
            {teamMembers.length === 0 && (
              <p className="no-members">No team members found</p>
            )}
          </div>

          {/* Auto-Distribution Info */}
          <div className="auto-distribution-info">
            <h4>🔄 Automatic Data Distribution</h4>
            <p>When you create this project, the system will automatically:</p>
            <ul>
              <li>✅ Create client record in CRM</li>
              <li>✅ Create project entry with all details</li>
              <li>✅ Generate invoice (if payment amount provided)</li>
              <li>✅ Create tasks for assigned team members</li>
            </ul>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating Project...' : '✨ Create Project'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;
