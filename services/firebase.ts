import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFirebaseConfigReport } from '../utils/firebaseDiagnostic';

// Firebase configuration using Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Log configuration report for debugging
console.log(getFirebaseConfigReport());

// Initialize Firebase with error handling
let app, auth, db, analytics;

try {
  // Check if we have a valid API key
  if (!import.meta.env.VITE_FIREBASE_API_KEY) {
    throw new Error('Missing Firebase API key. Please check your environment variables.');
  }
  
  // Validate that we have all required config values
  const requiredConfigValues = [
    firebaseConfig.apiKey,
    firebaseConfig.authDomain,
    firebaseConfig.projectId,
    firebaseConfig.storageBucket,
    firebaseConfig.messagingSenderId,
    firebaseConfig.appId
  ];
  
  const missingConfigCount = requiredConfigValues.filter(value => !value).length;
  
  if (missingConfigCount > 0) {
    console.warn('Firebase configuration is incomplete. Missing values:', missingConfigCount);
  }
  
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  console.error('Configuration report:', getFirebaseConfigReport());
  // Provide fallback objects to prevent app crashes
  app = null;
  auth = null;
  db = null;
  analytics = null;
}

export { auth, db, analytics };