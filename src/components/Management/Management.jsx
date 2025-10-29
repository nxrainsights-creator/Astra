import React, { useState, useEffect } from 'react';
import { managementService } from '../../firebase/services';
import './Management.css';

const Management = () => {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState([]);
  const [kpiData, setKpiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: [],
    department: '',
    priority: 'medium',
    status: 'pending',
    dueDate: '',
    estimatedHours: 0,
    tags: []
  });

  const departments = ['Development', 'Marketing', 'Finance', 'R&D', 'Operations', 'HR'];
  const priorities = ['low', 'medium', 'high', 'urgent'];
  const statuses = ['pending', 'in-progress', 'completed', 'on-hold'];

  useEffect(() => {
    if (activeTab === 'tasks') {
      loadTasks();
    } else if (activeTab === 'kpi') {
      loadKPIs();
    }
  }, [activeTab]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await managementService.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
      alert('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const loadKPIs = async () => {
    setLoading(true);
    try {
      const data = await managementService.getOverallKPIs();
      setKpiData(data);
    } catch (error) {
      console.error('Error loading KPIs:', error);
      alert('Failed to load KPIs');
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setTaskForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTask = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (editingTask) {
        await managementService.updateTask(editingTask.id, taskForm);
        alert('Task updated successfully!');
      } else {
        await managementService.createTask(taskForm);
        alert('Task created successfully!');
      }
      
      setShowTaskForm(false);
      setEditingTask(null);
      setTaskForm({
        title: '',
        description: '',
        assignedTo: [],
        department: '',
        priority: 'medium',
        status: 'pending',
        dueDate: '',
        estimatedHours: 0,
        tags: []
      });
      loadTasks();
    } catch (error) {
      console.error('Error saving task:', error);
      alert('Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      description: task.description,
      assignedTo: task.assignedTo || [],
      department: task.department,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      tags: task.tags || []
    });
    setShowTaskForm(true);
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await managementService.deleteTask(id);
      alert('Task deleted successfully!');
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task');
    }
  };

  const updateTaskStatus = async (id, status) => {
    try {
      await managementService.updateTask(id, { status });
      loadTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
      alert('Failed to update task status');
    }
  };

  return (
    <div className="management-container">
      <div className="management-header">
        <h1>📊 Management Panel</h1>
        <div className="management-tabs">
          <button
            className={activeTab === 'tasks' ? 'active' : ''}
            onClick={() => setActiveTab('tasks')}
          >
            Task Management
          </button>
          <button
            className={activeTab === 'kpi' ? 'active' : ''}
            onClick={() => setActiveTab('kpi')}
          >
            KPI Dashboard
          </button>
        </div>
      </div>

      {loading && <div className="loading">Loading...</div>}

      {/* Task Management */}
      {activeTab === 'tasks' && (
        <div className="tasks-content">
          <div className="tasks-header">
            <h2>Task Assignment Dashboard</h2>
            <button
              className="btn-primary"
              onClick={() => {
                setShowTaskForm(!showTaskForm);
                setEditingTask(null);
                setTaskForm({
                  title: '',
                  description: '',
                  assignedTo: [],
                  department: '',
                  priority: 'medium',
                  status: 'pending',
                  dueDate: '',
                  estimatedHours: 0,
                  tags: []
                });
              }}
            >
              {showTaskForm ? 'Cancel' : '+ Create Task'}
            </button>
          </div>

          {showTaskForm && (
            <form onSubmit={handleSubmitTask} className="task-form">
              <h3>{editingTask ? 'Edit Task' : 'New Task'}</h3>
              
              <div className="form-group">
                <label>Task Title *</label>
                <input
                  type="text"
                  name="title"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  rows="4"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    name="department"
                    value={taskForm.department}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    name="priority"
                    value={taskForm.priority}
                    onChange={handleFormChange}
                    required
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={taskForm.status}
                    onChange={handleFormChange}
                    required
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.split('-').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    name="dueDate"
                    value={taskForm.dueDate}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Estimated Hours</label>
                <input
                  type="number"
                  name="estimatedHours"
                  value={taskForm.estimatedHours}
                  onChange={handleFormChange}
                  min="0"
                  step="0.5"
                />
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
              </button>
            </form>
          )}

          <div className="tasks-list">
            <div className="tasks-grid">
              {tasks.map(task => (
                <div key={task.id} className="task-card">
                  <div className="task-header">
                    <h3>{task.title}</h3>
                    <span className={`priority-badge ${task.priority}`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="task-description">{task.description}</p>
                  
                  <div className="task-meta">
                    <span className="task-department">
                      🏢 {task.department}
                    </span>
                    <span className="task-hours">
                      ⏱️ {task.estimatedHours}h
                    </span>
                  </div>

                  <div className="task-status-row">
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                      className={`status-select ${task.status}`}
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="task-due">
                    📅 Due: {task.dueDate}
                  </div>

                  <div className="task-actions">
                    <button
                      className="btn-edit"
                      onClick={() => handleEditTask(task)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* KPI Dashboard */}
      {activeTab === 'kpi' && kpiData && (
        <div className="kpi-content">
          <div className="kpi-overview">
            <h2>Overall KPI Overview</h2>
            <div className="kpi-stats">
              <div className="kpi-card">
                <h3>Total Tasks</h3>
                <p className="kpi-value">{kpiData.totalTasks}</p>
              </div>
              <div className="kpi-card">
                <h3>Completed</h3>
                <p className="kpi-value">{kpiData.completedTasks}</p>
              </div>
              <div className="kpi-card">
                <h3>Completion Rate</h3>
                <p className="kpi-value">{kpiData.overallCompletionRate}%</p>
              </div>
            </div>
          </div>

          <div className="department-kpis">
            <h2>Department-wise Performance</h2>
            <div className="departments-grid">
              {kpiData.departmentBreakdown.map(dept => (
                <div key={dept.department} className="department-card">
                  <h3>{dept.department}</h3>
                  <div className="dept-stats">
                    <div className="dept-stat">
                      <span>Total Tasks</span>
                      <strong>{dept.totalTasks}</strong>
                    </div>
                    <div className="dept-stat">
                      <span>Completed</span>
                      <strong>{dept.completedTasks}</strong>
                    </div>
                    <div className="dept-stat">
                      <span>In Progress</span>
                      <strong>{dept.inProgressTasks}</strong>
                    </div>
                    <div className="dept-stat">
                      <span>Pending</span>
                      <strong>{dept.pendingTasks}</strong>
                    </div>
                    <div className="dept-stat">
                      <span>Overdue</span>
                      <strong className="overdue">{dept.overdueTasks}</strong>
                    </div>
                  </div>
                  <div className="completion-rate">
                    Completion Rate: <strong>{dept.completionRate}%</strong>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${dept.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Management;
