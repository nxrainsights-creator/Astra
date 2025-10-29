import React, { useState, useEffect } from 'react';
import { rndService } from '../../firebase/services';
import { storageService } from '../../firebase/storage';
import './RnDTracker.css';

const RnDTracker = () => {
  const [updates, setUpdates] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    teamMember: '',
    progress: 0,
    files: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    loadUpdates();
  }, []);

  const loadUpdates = async () => {
    setLoading(true);
    try {
      const data = await rndService.getAllUpdates();
      setUpdates(data);
    } catch (error) {
      alert('Error loading R&D updates: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUploading(true);

    try {
      let uploadedFiles = [];
      
      // Upload files to Firebase Storage
      if (selectedFiles.length > 0) {
        uploadedFiles = await storageService.uploadMultipleFiles(
          selectedFiles,
          'rnd_updates'
        );
      }

      // Save update to Firestore
      const updateData = {
        ...formData,
        files: uploadedFiles
      };

      await rndService.createUpdate(updateData);
      alert('Weekly update submitted successfully!');
      resetForm();
      loadUpdates();
    } catch (error) {
      alert('Error submitting update: ' + error.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      teamMember: '',
      progress: 0,
      files: []
    });
    setSelectedFiles([]);
    setShowForm(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return '#4CAF50';
    if (progress >= 50) return '#2196F3';
    if (progress >= 25) return '#FF9800';
    return '#f44336';
  };

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) return '🖼️';
    if (fileType?.includes('pdf')) return '📄';
    if (fileType?.includes('document') || fileType?.includes('word')) return '📝';
    return '📎';
  };

  return (
    <div className="rnd-tracker">
      <div className="rnd-header">
        <h1>R&D Progress Tracker</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Weekly Update'}
        </button>
      </div>

      {showForm && (
        <div className="update-form-container">
          <h2>Submit Weekly Update</h2>
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Update Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Week 45 - AI Model Training Progress"
              />
            </div>

            <div className="form-group">
              <label>Team Member *</label>
              <input
                type="text"
                required
                value={formData.teamMember}
                onChange={(e) => setFormData({ ...formData, teamMember: e.target.value })}
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label>Description / Progress Notes *</label>
              <textarea
                required
                rows="6"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe your research progress, findings, challenges, and next steps..."
              />
            </div>

            <div className="form-group">
              <label>Progress (%)</label>
              <div className="progress-input-container">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value) })}
                />
                <span className="progress-value">{formData.progress}%</span>
              </div>
            </div>

            <div className="form-group">
              <label>Upload Files (Images, PDFs, Documents)</label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                accept="image/*,.pdf,.doc,.docx"
              />
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <p>Selected {selectedFiles.length} file(s):</p>
                  <ul>
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024).toFixed(2)} KB)</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {uploading ? 'Uploading files...' : loading ? 'Submitting...' : 'Submit Update'}
              </button>
              <button type="button" className="btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && updates.length === 0 && (
        <div className="loading">Loading updates...</div>
      )}

      <div className="timeline">
        <h2>Updates Timeline</h2>
        {updates.length === 0 && !loading ? (
          <div className="empty-state">
            <p>No updates yet. Submit your first weekly update!</p>
          </div>
        ) : (
          <div className="timeline-container">
            {updates.map((update, index) => (
              <div key={update.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className="timeline-dot"></div>
                  {index < updates.length - 1 && <div className="timeline-line"></div>}
                </div>
                <div className="timeline-content">
                  <div className="update-card">
                    <div className="update-header">
                      <h3>{update.title}</h3>
                      <span className="update-date">{formatDate(update.createdAt)}</span>
                    </div>
                    <p className="update-member">By: {update.teamMember}</p>
                    <p className="update-description">{update.description}</p>
                    
                    <div className="progress-bar-container">
                      <div className="progress-label">
                        <span>Progress</span>
                        <span>{update.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{
                            width: `${update.progress}%`,
                            backgroundColor: getProgressColor(update.progress)
                          }}
                        ></div>
                      </div>
                    </div>

                    {update.files && update.files.length > 0 && (
                      <div className="update-files">
                        <h4>Attached Files:</h4>
                        <div className="files-grid">
                          {update.files.map((file, idx) => (
                            <a
                              key={idx}
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="file-item"
                            >
                              <span className="file-icon">{getFileIcon(file.type)}</span>
                              <span className="file-name">{file.name}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RnDTracker;
