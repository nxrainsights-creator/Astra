import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

// Validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Get all tasks (with optional filters)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, assignedTo, projectId } = req.query;
    
    let tasksQuery = db.collection('tasks');
    
    if (status) {
      tasksQuery = tasksQuery.where('status', '==', status);
    }
    if (assignedTo) {
      tasksQuery = tasksQuery.where('assignedTo', '==', assignedTo);
    }
    if (projectId) {
      tasksQuery = tasksQuery.where('projectId', '==', projectId);
    }
    
    const snapshot = await tasksQuery.orderBy('createdAt', 'desc').get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks'
    });
  }
});

// Get task by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const taskDoc = await db.collection('tasks').doc(id).get();
    
    if (!taskDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    res.status(200).json({
      success: true,
      task: { id: taskDoc.id, ...taskDoc.data() }
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch task'
    });
  }
});

// Create new task
router.post('/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('assignedTo').notEmpty().withMessage('Assigned user is required'),
    body('status').isIn(['pending', 'in-progress', 'completed']).withMessage('Invalid status')
  ],
  validate,
  async (req, res) => {
    try {
      const taskData = {
        ...req.body,
        assignedBy: req.user.uid,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const docRef = await db.collection('tasks').add(taskData);
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        task: { id: docRef.id, ...taskData }
      });
    } catch (error) {
      console.error('Create task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task'
      });
    }
  }
);

// Update task
router.put('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = {
        ...req.body,
        updatedAt: new Date()
      };
      
      await db.collection('tasks').doc(id).update(updateData);
      
      res.status(200).json({
        success: true,
        message: 'Task updated successfully'
      });
    } catch (error) {
      console.error('Update task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update task'
      });
    }
  }
);

// Delete task
router.delete('/:id',
  authenticateToken,
  authorize('admin', 'teamlead'),
  async (req, res) => {
    try {
      const { id } = req.params;
      await db.collection('tasks').doc(id).delete();
      
      res.status(200).json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Delete task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task'
      });
    }
  }
);

// Assign/reassign task
router.patch('/:id/assign',
  authenticateToken,
  [
    body('assignedTo').notEmpty().withMessage('User ID required')
  ],
  validate,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { assignedTo } = req.body;
      
      await db.collection('tasks').doc(id).update({
        assignedTo,
        reassignedBy: req.user.uid,
        updatedAt: new Date()
      });
      
      res.status(200).json({
        success: true,
        message: 'Task reassigned successfully'
      });
    } catch (error) {
      console.error('Reassign task error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to reassign task'
      });
    }
  }
);

export default router;
