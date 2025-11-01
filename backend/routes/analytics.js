import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    // Fetch counts from all collections
    const [clientsSnap, projectsSnap, tasksSnap, invoicesSnap, usersSnap] = await Promise.all([
      db.collection('clients').get(),
      db.collection('projects').get(),
      db.collection('tasks').get(),
      db.collection('invoices').get(),
      db.collection('users').get()
    ]);

    const tasks = tasksSnap.docs.map(doc => doc.data());
    const invoices = invoicesSnap.docs.map(doc => doc.data());
    const projects = projectsSnap.docs.map(doc => doc.data());

    // Calculate statistics
    const analytics = {
      totalClients: clientsSnap.size,
      totalProjects: projectsSnap.size,
      activeProjects: projects.filter(p => p.status !== 'completed').length,
      totalTasks: tasksSnap.size,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
      pendingTasks: tasks.filter(t => t.status === 'pending').length,
      inProgressTasks: tasks.filter(t => t.status === 'in-progress').length,
      totalInvoices: invoicesSnap.size,
      paidInvoices: invoices.filter(i => i.paymentStatus === 'paid').length,
      pendingInvoices: invoices.filter(i => i.paymentStatus === 'pending').length,
      overdueInvoices: invoices.filter(i => i.paymentStatus === 'overdue').length,
      totalRevenue: invoices.reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      paidRevenue: invoices
        .filter(i => i.paymentStatus === 'paid')
        .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      pendingRevenue: invoices
        .filter(i => i.paymentStatus === 'pending')
        .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      totalUsers: usersSnap.size,
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Get revenue analytics
router.get('/revenue', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('invoices').get();
    const invoices = snapshot.docs.map(doc => doc.data());

    const revenue = {
      total: invoices.reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      paid: invoices
        .filter(i => i.paymentStatus === 'paid')
        .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      pending: invoices
        .filter(i => i.paymentStatus === 'pending')
        .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0),
      overdue: invoices
        .filter(i => i.paymentStatus === 'overdue')
        .reduce((sum, inv) => sum + (inv.total || inv.amount || 0), 0)
    };

    res.status(200).json({ success: true, revenue });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch revenue data' });
  }
});

// Get task statistics
router.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const snapshot = await db.collection('tasks').get();
    const tasks = snapshot.docs.map(doc => doc.data());

    const stats = {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'completed').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      pending: tasks.filter(t => t.status === 'pending').length,
      completionRate: tasks.length > 0
        ? ((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100).toFixed(2)
        : 0
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch task statistics' });
  }
});

export default router;
