import express from 'express';
import { body, validationResult } from 'express-validator';
import { auth, db } from '../config/firebase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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

// Register new user
router.post('/register',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').notEmpty().withMessage('Name is required'),
    body('role').isIn(['admin', 'teamlead', 'member']).withMessage('Invalid role'),
    body('department').notEmpty().withMessage('Department is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password, name, role, department, phone } = req.body;

      // Create Firebase Auth user
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name
      });

      // Create user document in Firestore
      await db.collection('users').doc(userRecord.uid).set({
        name,
        email,
        role,
        department,
        phone: phone || '',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        userId: userRecord.uid
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Registration failed'
      });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  validate,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Note: Firebase client SDK handles authentication
      // This endpoint is for additional server-side validation if needed
      
      res.status(200).json({
        success: true,
        message: 'Login handled by Firebase client SDK'
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed'
      });
    }
  }
);

// Verify token
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token required'
      });
    }

    const decodedToken = await auth.verifyIdToken(token);
    
    res.status(200).json({
      success: true,
      user: decodedToken
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    // Firebase handles token refresh on client side
    res.status(200).json({
      success: true,
      message: 'Token refresh handled by Firebase client SDK'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

export default router;
