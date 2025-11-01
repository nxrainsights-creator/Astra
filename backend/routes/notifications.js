import express from 'express';
import { db } from '../config/firebase.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Send notification
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    
    const notificationData = {
      userId,
      title,
      message,
      type, // 'task', 'invoice', 'project', 'system'
      read: false,
      createdAt: new Date()
    };
    
    const docRef = await db.collection('notifications').add(notificationData);
    
    res.status(201).json({
      success: true,
      message: 'Notification sent',
      notification: { id: docRef.id, ...notificationData }
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification'
    });
  }
});

// Get user notifications
router.get('/user/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    
    const notifications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Mark notification as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    await db.collection('notifications').doc(req.params.id).update({
      read: true,
      readAt: new Date()
    });
    
    res.status(200).json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notification'
    });
  }
});

// Mark all notifications as read
router.patch('/user/:userId/read-all', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const snapshot = await db.collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .get();
    
    const batch = db.batch();
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { read: true, readAt: new Date() });
    });
    await batch.commit();
    
    res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      count: snapshot.size
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update notifications'
    });
  }
});

export default router;
