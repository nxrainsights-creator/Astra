import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import NewProject from '../NewProject/NewProject';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [showNewProject, setShowNewProject] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    ongoingProjects: 0,
    completedProjects: 0,
    totalRevenue: 0,
    pendingPayments: 0,
    totalClients: 0,
    myTasks: 0,
    pendingTasks: 0
  });
  const [revenueData, setRevenueData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all collections
      const [clientsSnap, projectsSnap, invoicesSnap, tasksSnap] = await Promise.all([
        getDocs(collection(db, 'clients')),
        getDocs(collection(db, 'projects')),
        getDocs(collection(db, 'invoices')),
        getDocs(collection(db, 'tasks'))
      ]);

      const clients = clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const projects = projectsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const invoices = invoicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const tasks = tasksSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Calculate stats
      const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const pendingPayments = invoices
        .filter(inv => inv.status === 'pending')
        .reduce((sum, inv) => sum + (inv.amount || 0), 0);

      const ongoingProjects = projects.filter(p => p.status === 'ongoing').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;

      const myTasks = tasks.filter(t => t.assignedTo === user?.uid).length;
      const pendingTasks = tasks.filter(t => t.status === 'pending' && t.assignedTo === user?.uid).length;

      setStats({
        totalProjects: projects.length,
        ongoingProjects,
        completedProjects,
        totalRevenue,
        pendingPayments,
        totalClients: clients.length,
        myTasks,
        pendingTasks
      });

      // Prepare chart data
      const projectStatusData = [
        { name: 'Ongoing', value: ongoingProjects, color: '#2196F3' },
        { name: 'Completed', value: completedProjects, color: '#4CAF50' },
        { name: 'Planning', value: projects.filter(p => p.status === 'planning').length, color: '#FF9800' }
      ];
      setProjectData(projectStatusData);

      // Mock revenue data (you can replace with actual monthly data)
      const monthlyRevenue = [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 55000 },
        { month: 'Jun', revenue: totalRevenue }
      ];
      setRevenueData(monthlyRevenue);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Welcome back, {user?.name || 'User'}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your business today.</p>
        </div>
        <div className="user-role-badge">
          <span className="role-icon">
            {user?.role === 'admin' ? '👑' : user?.role === 'teamlead' ? '⭐' : '👤'}
          </span>
          <span className="role-text">{user?.role || 'Member'}</span>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>Total Revenue</h3>
            <p className="stat-value">₹{stats.totalRevenue.toLocaleString()}</p>
            <span className="stat-label">This month</span>
          </div>
        </div>

        <div className="stat-card stat-warning">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <h3>Pending Payments</h3>
            <p className="stat-value">₹{stats.pendingPayments.toLocaleString()}</p>
            <span className="stat-label">Outstanding</span>
          </div>
        </div>

        <div className="stat-card stat-success">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Projects</h3>
            <p className="stat-value">{stats.totalProjects}</p>
            <span className="stat-label">{stats.ongoingProjects} ongoing</span>
          </div>
        </div>

        <div className="stat-card stat-info">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Clients</h3>
            <p className="stat-value">{stats.totalClients}</p>
            <span className="stat-label">Active clients</span>
          </div>
        </div>

        <div className="stat-card stat-purple">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>My Tasks</h3>
            <p className="stat-value">{stats.myTasks}</p>
            <span className="stat-label">{stats.pendingTasks} pending</span>
          </div>
        </div>

        <div className="stat-card stat-teal">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>Completion Rate</h3>
            <p className="stat-value">
              {stats.totalProjects > 0 
                ? Math.round((stats.completedProjects / stats.totalProjects) * 100) 
                : 0}%
            </p>
            <span className="stat-label">Project success</span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        <div className="chart-card">
          <h3>Monthly Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#2196F3" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={projectData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {projectData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => setShowNewProject(true)}>
            <span className="action-icon">➕</span>
            <span>New Project</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">👥</span>
            <span>Add Client</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">🧾</span>
            <span>Generate Invoice</span>
          </button>
          <button className="action-btn">
            <span className="action-icon">✅</span>
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* New Project Modal */}
      {showNewProject && (
        <NewProject
          onClose={() => setShowNewProject(false)}
          onSuccess={loadDashboardData}
          currentUser={user}
        />
      )}
    </div>
  );
};

export default Dashboard;
