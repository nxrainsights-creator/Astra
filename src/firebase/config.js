// Firebase Configuration for NXRA Portal
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLogsJmDhAbBYWAaa9RFg4Vd0gyiT81iA",
  authDomain: "nxra-portal.firebaseapp.com",
  projectId: "nxra-portal",
  storageBucket: "nxra-portal.firebasestorage.app",
  messagingSenderId: "1084781179957",
  appId: "1:1084781179957:web:d45e5c46fd90f719286d7c",
  measurementId: "G-VKKXZ67TNX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, analytics, db, storage, auth };
