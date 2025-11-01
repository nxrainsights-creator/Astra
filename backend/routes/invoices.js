import express from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../config/firebase.js';
import { authenticateToken, authorize } from '../middleware/auth.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

// Get all invoices
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, clientId } = req.query;
    let query = db.collection('invoices');
    
    if (status) query = query.where('paymentStatus', '==', status);
    if (clientId) query = query.where('clientId', '==', clientId);
    
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const invoices = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    res.status(200).json({ success: true, count: invoices.length, invoices });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch invoices' });
  }
});

// Get invoice by ID
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const doc = await db.collection('invoices').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.status(200).json({ success: true, invoice: { id: doc.id, ...doc.data() } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch invoice' });
  }
});

// Create invoice
router.post('/',
  authenticateToken,
  [
    body('clientId').notEmpty(),
    body('amount').isNumeric(),
    body('paymentStatus').isIn(['pending', 'paid', 'overdue'])
  ],
  validate,
  async (req, res) => {
    try {
      const invoiceData = {
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      const docRef = await db.collection('invoices').add(invoiceData);
      res.status(201).json({
        success: true,
        message: 'Invoice created',
        invoice: { id: docRef.id, ...invoiceData }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create invoice' });
    }
  }
);

// Update invoice
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    await db.collection('invoices').doc(req.params.id).update({
      ...req.body,
      updatedAt: new Date()
    });
    res.status(200).json({ success: true, message: 'Invoice updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update invoice' });
  }
});

// Delete invoice
router.delete('/:id', authenticateToken, authorize('admin'), async (req, res) => {
  try {
    await db.collection('invoices').doc(req.params.id).delete();
    res.status(200).json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete invoice' });
  }
});

export default router;
