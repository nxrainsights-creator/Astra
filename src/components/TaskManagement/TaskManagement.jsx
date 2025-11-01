import React, { useState, useEffect } from 'react';
import { taskService, userService, projectService } from '../../firebase/services';
import './TaskManagement.css';

const TaskManagement = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterView, setFilterView] = useState('my-tasks'); // my-tasks, assigned-by-me, all
  
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'medium',
    dueDate: '',
    status: 'pending'
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [tasks, filterStatus, filterView, user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData, usersData] = await Promise.all([
        taskService.getAllTasks(),
        projectService.getAllProjects(),
        userService.getAllUsers()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setTeamMembers(usersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...tasks];

    // Filter by view
    if (filterView === 'my-tasks') {
      filtered = filtered.filter(task => task.assignedTo === user?.uid);
    } else if (filterView === 'assigned-by-me') {
      filtered = filtered.filter(task => task.assignedBy === user?.uid);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus);
    }

    setFilteredTasks(filtered);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await taskService.createTask({
        ...taskFormData,
        assignedBy: user?.uid
      });
      alert('Task created successfully!');
      setShowTaskForm(false);
      resetTaskForm();
      loadData();
    } catch (error) {
      alert('Error creating task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTaskStatus = async (taskId, newStatus) => {
    setLoading(true);
    try {
      await taskService.updateTask(taskId, { status: newStatus });
      loadData();
    } catch (error) {
      alert('Error updating task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReassignTask = async (taskId, newAssignee) => {
    if (!newAssignee) return;
    setLoading(true);
    try {
      await taskService.updateTask(taskId, { 
        assignedTo: newAssignee,
        reassignedBy: user?.uid
      });
      alert('Task reassigned successfully!');
      loadData();
    } catch (error) {
      alert('Error reassigning task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    setLoading(true);
    try {
      await taskService.deleteTask(taskId);
      alert('Task deleted successfully!');
      loadData();
    } catch (error) {
      alert('Error deleting task: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetTaskForm = () => {
    setTaskFormData({
      title: '',
      description: '',
      projectId: '',
      assignedTo: '',
      priority: 'medium',
      dueDate: '',
      status: 'pending'
    });
  };

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project?.name || 'Unknown Project';
  };

  const getUserName = (userId) => {
    const member = teamMembers.find(m => m.id === userId);
    return member?.name || 'Unknown User';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#757575';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#4CAF50';
      case 'in-progress': return '#2196F3';
      case 'pending': return '#FF9800';
      default: return '#757575';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = dateString.toDate ? dateString.toDate() : new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="task-management">
      <div className="task-header">
        <h1>Task Management</h1>
        <button className="btn-primary" onClick={() => setShowTaskForm(!showTaskForm)}>
          {showTaskForm ? 'Cancel' : '+ Create Task'}
        </button>
      </div>

      {/* Task Form */}
      {showTaskForm && (
        <div className="task-form-container">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask} className="task-form">
            <div className="form-row">
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  required
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  placeholder="Enter task title"
                />
              </div>
              <div className="form-group">
                <label>Project</label>
                <select
                  value={taskFormData.projectId}
                  onChange={(e) => setTaskFormData({ ...taskFormData, projectId: e.target.value })}
                >
                  <option value="">Select project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                rows="3"
                value={taskFormData.description}
                onChange={(e) => setTaskFormData({ ...taskFormData, description: e.target.value })}
                placeholder="Task description..."
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Assign To *</label>
                <select
                  required
                  value={taskFormData.assignedTo}
                  onChange={(e) => setTaskFormData({ ...taskFormData, assignedTo: e.target.value })}
                >
                  <option value="">Select team member</option>
                  {teamMembers.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({member.role})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Priority</label>
                <select
                  value={taskFormData.priority}
                  onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={taskFormData.dueDate}
                onChange={(e) => setTaskFormData({ ...taskFormData, dueDate: e.target.value })}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Task'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => setShowTaskForm(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="task-filters">
        <div className="filter-group">
          <label>View:</label>
          <select value={filterView} onChange={(e) => setFilterView(e.target.value)}>
            <option value="my-tasks">Tasks Assigned to Me</option>
            <option value="assigned-by-me">Tasks I Assigned</option>
            {user?.role === 'admin' && <option value="all">All Tasks</option>}
          </select>
        </div>

        <div className="filter-group">
          <label>Status:</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="task-stats">
          <span className="stat-badge">Total: {filteredTasks.length}</span>
          <span className="stat-badge stat-pending">
            Pending: {filteredTasks.filter(t => t.status === 'pending').length}
          </span>
          <span className="stat-badge stat-progress">
            In Progress: {filteredTasks.filter(t => t.status === 'in-progress').length}
          </span>
          <span className="stat-badge stat-completed">
            Completed: {filteredTasks.filter(t => t.status === 'completed').length}
          </span>
        </div>
      </div>

      {loading && <div className="loading">Loading tasks...</div>}

      {/* Task List */}
      <div className="tasks-grid">
        {filteredTasks.map((task) => (
          <div key={task.id} className="task-card">
            <div className="task-card-header">
              <h3>{task.title}</h3>
              <span 
                className="priority-badge"
                style={{ backgroundColor: getPriorityColor(task.priority) }}
              >
                {task.priority}
              </span>
            </div>

            <p className="task-description">{task.description}</p>

            <div className="task-info">
              {task.projectId && (
                <p><strong>Project:</strong> {getProjectName(task.projectId)}</p>
              )}
              <p><strong>Assigned To:</strong> {getUserName(task.assignedTo)}</p>
              <p><strong>Assigned By:</strong> {getUserName(task.assignedBy)}</p>
              {task.dueDate && (
                <p><strong>Due:</strong> {formatDate(task.dueDate)}</p>
              )}
            </div>

            <div className="task-status-section">
              <label>Status:</label>
              <select
                value={task.status}
                onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value)}
                style={{ backgroundColor: getStatusColor(task.status) }}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="task-actions">
              {(user?.uid === task.assignedBy || user?.role === 'admin') && (
                <>
                  <select
                    className="reassign-select"
                    onChange={(e) => handleReassignTask(task.id, e.target.value)}
                  >
                    <option value="">Reassign to...</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="empty-state">
          <p>No tasks found. {filterView === 'my-tasks' ? 'You have no tasks assigned.' : 'Create your first task!'}</p>
        </div>
      )}
    </div>
  );
};

export default TaskManagement;
