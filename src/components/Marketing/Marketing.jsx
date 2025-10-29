import React, { useState, useEffect } from 'react';
import { marketingService } from '../../firebase/services';
import './Marketing.css';

const Marketing = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [festivals, setFestivals] = useState([]);
  const [activeTab, setActiveTab] = useState('campaigns');
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [showFestivalForm, setShowFestivalForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [campaignFormData, setCampaignFormData] = useState({
    name: '',
    platform: 'facebook',
    status: 'planning',
    budget: '',
    startDate: '',
    endDate: '',
    description: '',
    metrics: {
      impressions: 0,
      clicks: 0,
      conversions: 0
    }
  });
  const [festivalFormData, setFestivalFormData] = useState({
    name: '',
    date: '',
    description: '',
    category: 'national'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [campaignsData, festivalsData] = await Promise.all([
        marketingService.getAllCampaigns(),
        marketingService.getFestivalCalendar()
      ]);
      setCampaigns(campaignsData);
      setFestivals(festivalsData);
    } catch (error) {
      alert('Error loading data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCampaignSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await marketingService.createCampaign(campaignFormData);
      alert('Campaign created successfully!');
      resetCampaignForm();
      loadData();
    } catch (error) {
      alert('Error creating campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFestivalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await marketingService.addFestivalEvent(festivalFormData);
      alert('Festival added successfully!');
      resetFestivalForm();
      loadData();
    } catch (error) {
      alert('Error adding festival: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaignStatus = async (id, newStatus) => {
    setLoading(true);
    try {
      await marketingService.updateCampaign(id, { status: newStatus });
      alert('Campaign status updated!');
      loadData();
    } catch (error) {
      alert('Error updating campaign: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetCampaignForm = () => {
    setCampaignFormData({
      name: '',
      platform: 'facebook',
      status: 'planning',
      budget: '',
      startDate: '',
      endDate: '',
      description: '',
      metrics: {
        impressions: 0,
        clicks: 0,
        conversions: 0
      }
    });
    setShowCampaignForm(false);
  };

  const resetFestivalForm = () => {
    setFestivalFormData({
      name: '',
      date: '',
      description: '',
      category: 'national'
    });
    setShowFestivalForm(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#4CAF50';
      case 'completed': return '#2196F3';
      case 'paused': return '#FF9800';
      case 'planning': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'facebook': return '📘';
      case 'instagram': return '📸';
      case 'twitter': return '🐦';
      case 'linkedin': return '💼';
      case 'google': return '🔍';
      default: return '📱';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getUpcomingFestivals = () => {
    const today = new Date();
    return festivals
      .filter(f => new Date(f.date) >= today)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(0, 5);
  };

  return (
    <div className="marketing">
      <div className="marketing-header">
        <h1>Social Media & Marketing</h1>
      </div>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'campaigns' ? 'active' : ''}`}
          onClick={() => setActiveTab('campaigns')}
        >
          Campaign Tracker
        </button>
        <button
          className={`tab ${activeTab === 'festivals' ? 'active' : ''}`}
          onClick={() => setActiveTab('festivals')}
        >
          Festival Calendar
        </button>
        <button
          className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          Performance Report
        </button>
      </div>

      {/* Campaign Tracker Tab */}
      {activeTab === 'campaigns' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Campaign Tracker</h2>
            <button className="btn-primary" onClick={() => setShowCampaignForm(!showCampaignForm)}>
              {showCampaignForm ? 'Cancel' : '+ New Campaign'}
            </button>
          </div>

          {showCampaignForm && (
            <div className="form-container">
              <form onSubmit={handleCampaignSubmit} className="campaign-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Campaign Name *</label>
                    <input
                      type="text"
                      required
                      value={campaignFormData.name}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Platform *</label>
                    <select
                      value={campaignFormData.platform}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, platform: e.target.value })}
                    >
                      <option value="facebook">Facebook</option>
                      <option value="instagram">Instagram</option>
                      <option value="twitter">Twitter</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="google">Google Ads</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Budget</label>
                    <input
                      type="text"
                      value={campaignFormData.budget}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, budget: e.target.value })}
                      placeholder="e.g., $5000"
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={campaignFormData.status}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, status: e.target.value })}
                    >
                      <option value="planning">Planning</option>
                      <option value="active">Active</option>
                      <option value="paused">Paused</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Start Date</label>
                    <input
                      type="date"
                      value={campaignFormData.startDate}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, startDate: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>End Date</label>
                    <input
                      type="date"
                      value={campaignFormData.endDate}
                      onChange={(e) => setCampaignFormData({ ...campaignFormData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="4"
                    value={campaignFormData.description}
                    onChange={(e) => setCampaignFormData({ ...campaignFormData, description: e.target.value })}
                    placeholder="Campaign objectives and details..."
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Campaign'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetCampaignForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="campaigns-grid">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="campaign-card">
                <div className="campaign-header">
                  <div>
                    <span className="platform-icon">{getPlatformIcon(campaign.platform)}</span>
                    <h3>{campaign.name}</h3>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(campaign.status) }}
                  >
                    {campaign.status}
                  </span>
                </div>
                <p className="campaign-description">{campaign.description}</p>
                <div className="campaign-info">
                  {campaign.budget && <p><strong>Budget:</strong> {campaign.budget}</p>}
                  {campaign.startDate && (
                    <p><strong>Duration:</strong> {formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p>
                  )}
                </div>
                {campaign.metrics && (
                  <div className="metrics">
                    <div className="metric">
                      <span className="metric-value">{campaign.metrics.impressions || 0}</span>
                      <span className="metric-label">Impressions</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{campaign.metrics.clicks || 0}</span>
                      <span className="metric-label">Clicks</span>
                    </div>
                    <div className="metric">
                      <span className="metric-value">{campaign.metrics.conversions || 0}</span>
                      <span className="metric-label">Conversions</span>
                    </div>
                  </div>
                )}
                <div className="campaign-actions">
                  <button
                    className="btn-status"
                    onClick={() => handleUpdateCampaignStatus(
                      campaign.id,
                      campaign.status === 'active' ? 'paused' : 'active'
                    )}
                  >
                    {campaign.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {campaigns.length === 0 && !loading && (
            <div className="empty-state">
              <p>No campaigns yet. Create your first marketing campaign!</p>
            </div>
          )}
        </div>
      )}

      {/* Festival Calendar Tab */}
      {activeTab === 'festivals' && (
        <div className="tab-content">
          <div className="content-header">
            <h2>Festival Calendar</h2>
            <button className="btn-primary" onClick={() => setShowFestivalForm(!showFestivalForm)}>
              {showFestivalForm ? 'Cancel' : '+ Add Festival'}
            </button>
          </div>

          {showFestivalForm && (
            <div className="form-container">
              <form onSubmit={handleFestivalSubmit} className="festival-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Festival Name *</label>
                    <input
                      type="text"
                      required
                      value={festivalFormData.name}
                      onChange={(e) => setFestivalFormData({ ...festivalFormData, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      required
                      value={festivalFormData.date}
                      onChange={(e) => setFestivalFormData({ ...festivalFormData, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={festivalFormData.category}
                    onChange={(e) => setFestivalFormData({ ...festivalFormData, category: e.target.value })}
                  >
                    <option value="national">National</option>
                    <option value="religious">Religious</option>
                    <option value="cultural">Cultural</option>
                    <option value="international">International</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={festivalFormData.description}
                    onChange={(e) => setFestivalFormData({ ...festivalFormData, description: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Adding...' : 'Add Festival'}
                  </button>
                  <button type="button" className="btn-secondary" onClick={resetFestivalForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="festivals-container">
            <h3>Upcoming Festivals</h3>
            <div className="festivals-list">
              {getUpcomingFestivals().map((festival) => (
                <div key={festival.id} className="festival-item">
                  <div className="festival-date">
                    <span className="date-day">{new Date(festival.date).getDate()}</span>
                    <span className="date-month">
                      {new Date(festival.date).toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </div>
                  <div className="festival-details">
                    <h4>{festival.name}</h4>
                    <p>{festival.description}</p>
                    <span className="festival-category">{festival.category}</span>
                  </div>
                </div>
              ))}
            </div>

            {festivals.length > 5 && (
              <>
                <h3 style={{ marginTop: '40px' }}>All Festivals</h3>
                <div className="festivals-grid">
                  {festivals
                    .sort((a, b) => new Date(a.date) - new Date(b.date))
                    .map((festival) => (
                      <div key={festival.id} className="festival-card">
                        <h4>{festival.name}</h4>
                        <p className="festival-date-text">{formatDate(festival.date)}</p>
                        <p>{festival.description}</p>
                        <span className="festival-category">{festival.category}</span>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>

          {festivals.length === 0 && !loading && (
            <div className="empty-state">
              <p>No festivals added yet. Add festivals to plan your marketing campaigns!</p>
            </div>
          )}
        </div>
      )}

      {/* Performance Report Tab */}
      {activeTab === 'performance' && (
        <div className="tab-content">
          <h2>Performance Dashboard</h2>
          <div className="performance-dashboard">
            <div className="performance-card">
              <h3>Total Campaigns</h3>
              <p className="performance-value">{campaigns.length}</p>
            </div>
            <div className="performance-card">
              <h3>Active Campaigns</h3>
              <p className="performance-value">
                {campaigns.filter(c => c.status === 'active').length}
              </p>
            </div>
            <div className="performance-card">
              <h3>Total Impressions</h3>
              <p className="performance-value">
                {campaigns.reduce((sum, c) => sum + (c.metrics?.impressions || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="performance-card">
              <h3>Total Clicks</h3>
              <p className="performance-value">
                {campaigns.reduce((sum, c) => sum + (c.metrics?.clicks || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="performance-card">
              <h3>Total Conversions</h3>
              <p className="performance-value">
                {campaigns.reduce((sum, c) => sum + (c.metrics?.conversions || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="performance-card">
              <h3>Upcoming Festivals</h3>
              <p className="performance-value">{getUpcomingFestivals().length}</p>
            </div>
          </div>

          <div className="campaign-status-breakdown">
            <h3>Campaign Status Breakdown</h3>
            <div className="status-bars">
              {['planning', 'active', 'paused', 'completed'].map(status => {
                const count = campaigns.filter(c => c.status === status).length;
                const percentage = campaigns.length > 0 ? (count / campaigns.length) * 100 : 0;
                return (
                  <div key={status} className="status-bar-item">
                    <div className="status-bar-header">
                      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
                      <span>{count} campaigns</span>
                    </div>
                    <div className="status-bar">
                      <div
                        className="status-bar-fill"
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getStatusColor(status)
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;
