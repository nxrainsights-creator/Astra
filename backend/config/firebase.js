import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Firebase Admin SDK
try {
  // For development: using project ID only (requires Firebase CLI login)
  // For production: add service account credentials to .env
  if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL
    };
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  } else {
    // Development mode: using project ID only
    console.warn('⚠️  Running in development mode without service account credentials');
    console.log('ℹ️  To use full backend features, add Firebase service account to .env');
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID
    });
  }
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  process.exit(1);
}

export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
