import React, { useState, useEffect } from 'react';
import { userService, projectService, taskService } from '../../firebase/services';
import './Teams.css';

const Teams = ({ user }) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const departments = [
    { id: 'all', name: 'All Teams', icon: '👥', color: '#667eea' },
    { id: 'finance', name: 'Finance', icon: '💰', color: '#4CAF50' },
    { id: 'client', name: 'Client Services', icon: '👤', color: '#2196F3' },
    { id: 'rnd', name: 'R&D', icon: '🔬', color: '#9C27B0' },
    { id: 'marketing', name: 'Marketing', icon: '📱', color: '#FF9800' },
    { id: 'management', name: 'Management', icon: '📊', color: '#f44336' }
  ];

  const [newMemberData, setNewMemberData] = useState({
    name: '',
    email: '',
    role: 'member',
    department: 'client',
    phone: '',
    joinDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [membersData, projectsData, tasksData] = await Promise.all([
        userService.getAllUsers(),
        projectService.getAllProjects(),
        taskService.getAllTasks()
      ]);
      setTeamMembers(membersData);
      setProjects(projectsData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: In production, this would create a Firebase Auth user
      // For now, we'll just add to Firestore users collection
      await userService.createUser(newMemberData);
      alert('Team member added successfully!');
      setShowAddMemberForm(false);
      setNewMemberData({
        name: '',
        email: '',
        role: 'member',
        department: 'client',
        phone: '',
        joinDate: new Date().toISOString().split('T')[0]
      });
      loadData();
    } catch (error) {
      alert('Error adding member: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMemberStats = (memberId) => {
    const memberTasks = tasks.filter(t => t.assignedTo === memberId);
    const memberProjects = projects.filter(p => 
      p.assignedMembers && p.assignedMembers.includes(memberId)
    );

    return {
      totalTasks: memberTasks.length,
      completedTasks: memberTasks.filter(t => t.status === 'completed').length,
      pendingTasks: memberTasks.filter(t => t.status === 'pending').length,
      inProgressTasks: memberTasks.filter(t => t.status === 'in-progress').length,
      totalProjects: memberProjects.length,
      activeProjects: memberProjects.filter(p => p.status !== 'completed').length
    };
  };

  const getDepartmentStats = (department) => {
    const deptMembers = department === 'all' 
      ? teamMembers 
      : teamMembers.filter(m => m.department === department);
    
    const deptMemberIds = deptMembers.map(m => m.id);
    const deptTasks = tasks.filter(t => deptMemberIds.includes(t.assignedTo));
    const deptProjects = projects.filter(p => 
      p.assignedMembers && p.assignedMembers.some(id => deptMemberIds.includes(id))
    );

    return {
      totalMembers: deptMembers.length,
      totalTasks: deptTasks.length,
      completedTasks: deptTasks.filter(t => t.status === 'completed').length,
      totalProjects: deptProjects.length,
      activeProjects: deptProjects.filter(p => p.status !== 'completed').length
    };
  };

  const filteredMembers = selectedDepartment === 'all'
    ? teamMembers
    : teamMembers.filter(m => m.department === selectedDepartment);

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#f44336';
      case 'teamlead': return '#FF9800';
      case 'member': return '#2196F3';
      default: return '#757575';
    }
  };

  const getDepartmentColor = (department) => {
    const dept = departments.find(d => d.id === department);
    return dept ? dept.color : '#757575';
  };

  const calculateCompletionRate = (stats) => {
    if (stats.totalTasks === 0) return 0;
    return Math.round((stats.completedTasks / stats.totalTasks) * 100);
  };

  const handleViewMemberDetails = (member) => {
    setSelectedMember(member);
  };

  const handleCloseDetails = () => {
    setSelectedMember(null);
  };

  return (
    <div className="teams">
      <div className="teams-header">
        <h1>Team Management</h1>
        {user?.role === 'admin' && (
          <button className="btn-primary" onClick={() => setShowAddMemberForm(!showAddMemberForm)}>
            {showAddMemberForm ? 'Cancel' : '+ Add Member'}
          </button>
        )}
      </div>

      {/* Add Member Form */}
      {showAddMemberForm && user?.role === 'admin' && (
        <div className="add-member-form-container">
          <h2>Add New Team Member</h2>
          <form onSubmit={handleAddMember} className="add-member-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  required
                  value={newMemberData.name}
                  onChange={(e) => setNewMemberData({ ...newMemberData, name: e.target.value })}
                  placeholder="Full name"
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  required
                  value={newMemberData.email}
                  onChange={(e) => setNewMemberData({ ...newMemberData, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={newMemberData.phone}
                  onChange={(e) => setNewMemberData({ ...newMemberData, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
              <div className="form-group">
                <label>Join Date</label>
                <input
                  type="date"
                  value={newMemberData.joinDate}
                  onChange={(e) => setNewMemberData({ ...newMemberData, joinDate: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Role *</label>
                <select
                  required
                  value={newMemberData.role}
                  onChange={(e) => setNewMemberData({ ...newMemberData, role: e.target.value })}
                >
                  <option value="member">Member</option>
                  <option value="teamlead">Team Lead</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select
                  required
                  value={newMemberData.department}
                  onChange={(e) => setNewMemberData({ ...newMemberData, department: e.target.value })}
                >
                  <option value="client">Client Services</option>
                  <option value="finance">Finance</option>
                  <option value="rnd">R&D</option>
                  <option value="marketing">Marketing</option>
                  <option value="management">Management</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Adding...' : 'Add Member'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowAddMemberForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Department Tabs */}
      <div className="department-tabs">
        {departments.map(dept => {
          const stats = getDepartmentStats(dept.id);
          return (
            <div
              key={dept.id}
              className={`department-tab ${selectedDepartment === dept.id ? 'active' : ''}`}
              onClick={() => setSelectedDepartment(dept.id)}
              style={{
                borderColor: selectedDepartment === dept.id ? dept.color : 'transparent'
              }}
            >
              <div className="tab-icon" style={{ backgroundColor: dept.color }}>
                {dept.icon}
              </div>
              <div className="tab-info">
                <h3>{dept.name}</h3>
                <div className="tab-stats">
                  <span>{stats.totalMembers} members</span>
                  <span>{stats.activeProjects} projects</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Department Overview Stats */}
      <div className="department-overview">
        {(() => {
          const stats = getDepartmentStats(selectedDepartment);
          return (
            <>
              <div className="overview-card">
                <h3>Team Members</h3>
                <p className="overview-value">{stats.totalMembers}</p>
              </div>
              <div className="overview-card">
                <h3>Active Projects</h3>
                <p className="overview-value">{stats.activeProjects}</p>
                <span className="overview-sub">of {stats.totalProjects} total</span>
              </div>
              <div className="overview-card">
                <h3>Total Tasks</h3>
                <p className="overview-value">{stats.totalTasks}</p>
              </div>
              <div className="overview-card">
                <h3>Completion Rate</h3>
                <p className="overview-value">
                  {stats.totalTasks > 0 
                    ? Math.round((stats.completedTasks / stats.totalTasks) * 100) 
                    : 0}%
                </p>
                <span className="overview-sub">{stats.completedTasks} completed</span>
              </div>
            </>
          );
        })()}
      </div>

      {loading && <div className="loading">Loading team data...</div>}

      {/* Team Members Grid */}
      <div className="team-members-grid">
        {filteredMembers.map((member) => {
          const stats = getMemberStats(member.id);
          const completionRate = calculateCompletionRate(stats);

          return (
            <div key={member.id} className="member-card">
              <div className="member-card-header">
                <div className="member-avatar" style={{ backgroundColor: getDepartmentColor(member.department) }}>
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-email">{member.email}</p>
                  <div className="member-badges">
                    <span 
                      className="role-badge"
                      style={{ backgroundColor: getRoleColor(member.role) }}
                    >
                      {member.role}
                    </span>
                    <span 
                      className="dept-badge"
                      style={{ backgroundColor: getDepartmentColor(member.department) }}
                    >
                      {departments.find(d => d.id === member.department)?.name || member.department}
                    </span>
                  </div>
                </div>
              </div>

              <div className="member-stats">
                <div className="stat-row">
                  <span className="stat-label">Projects:</span>
                  <span className="stat-value">{stats.totalProjects}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Total Tasks:</span>
                  <span className="stat-value">{stats.totalTasks}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Completed:</span>
                  <span className="stat-value success">{stats.completedTasks}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">In Progress:</span>
                  <span className="stat-value progress">{stats.inProgressTasks}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Pending:</span>
                  <span className="stat-value pending">{stats.pendingTasks}</span>
                </div>
              </div>

              <div className="completion-bar">
                <div className="completion-label">
                  <span>Task Completion</span>
                  <span className="completion-percent">{completionRate}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${completionRate}%`,
                      backgroundColor: completionRate >= 75 ? '#4CAF50' : completionRate >= 50 ? '#FF9800' : '#f44336'
                    }}
                  />
                </div>
              </div>

              <button 
                className="btn-view-details"
                onClick={() => handleViewMemberDetails(member)}
              >
                View Details
              </button>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && !loading && (
        <div className="empty-state">
          <p>No team members found in this department.</p>
        </div>
      )}

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content member-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedMember.name}</h2>
              <button className="btn-close" onClick={handleCloseDetails}>×</button>
            </div>

            <div className="member-details-content">
              <div className="details-section">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> {selectedMember.email}</p>
                <p><strong>Phone:</strong> {selectedMember.phone || 'N/A'}</p>
                <p><strong>Department:</strong> {departments.find(d => d.id === selectedMember.department)?.name}</p>
                <p><strong>Role:</strong> {selectedMember.role}</p>
              </div>

              <div className="details-section">
                <h3>Performance Metrics</h3>
                {(() => {
                  const stats = getMemberStats(selectedMember.id);
                  return (
                    <div className="metrics-grid">
                      <div className="metric">
                        <span className="metric-value">{stats.totalProjects}</span>
                        <span className="metric-label">Projects</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{stats.totalTasks}</span>
                        <span className="metric-label">Total Tasks</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{stats.completedTasks}</span>
                        <span className="metric-label">Completed</span>
                      </div>
                      <div className="metric">
                        <span className="metric-value">{calculateCompletionRate(stats)}%</span>
                        <span className="metric-label">Success Rate</span>
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="details-section">
                <h3>Assigned Projects</h3>
                <div className="projects-list">
                  {projects
                    .filter(p => p.assignedMembers && p.assignedMembers.includes(selectedMember.id))
                    .map(project => (
                      <div key={project.id} className="project-item">
                        <span className="project-name">{project.name}</span>
                        <span className={`project-status ${project.status}`}>
                          {project.status || 'active'}
                        </span>
                      </div>
                    ))}
                  {projects.filter(p => p.assignedMembers && p.assignedMembers.includes(selectedMember.id)).length === 0 && (
                    <p className="no-data">No projects assigned</p>
                  )}
                </div>
              </div>

              <div className="details-section">
                <h3>Recent Tasks</h3>
                <div className="tasks-list">
                  {tasks
                    .filter(t => t.assignedTo === selectedMember.id)
                    .slice(0, 5)
                    .map(task => (
                      <div key={task.id} className="task-item">
                        <span className="task-title">{task.title}</span>
                        <span className={`task-status ${task.status}`}>
                          {task.status}
                        </span>
                      </div>
                    ))}
                  {tasks.filter(t => t.assignedTo === selectedMember.id).length === 0 && (
                    <p className="no-data">No tasks assigned</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams;
