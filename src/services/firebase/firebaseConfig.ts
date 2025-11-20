// Firebase Configuration

import Constants from 'expo-constants';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

// Get config from app.config.ts extra field
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey || '',
  authDomain: extra.firebaseAuthDomain || '',
  projectId: extra.firebaseProjectId || '',
  storageBucket: extra.firebaseStorageBucket || '',
  messagingSenderId: extra.firebaseMessagingSenderId || '',
  appId: extra.firebaseAppId || '',
};

// Validate configuration
const isConfigValid = Object.values(firebaseConfig).every(value => value !== '');

if (!isConfigValid) {
  console.warn('Firebase configuration is incomplete. Please update your .env file.');
}

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let firestore: Firestore;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Auth (persistence is handled automatically by Firebase)
  auth = getAuth(app);
  
  firestore = getFirestore(app);
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}

export { app, auth, firestore };
export const isFirebaseConfigured = isConfigValid;
