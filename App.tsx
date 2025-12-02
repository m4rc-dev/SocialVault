import React, { useState, useEffect, useRef } from 'react';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { User } from './types';
import * as db from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAuth = useRef(false);

  useEffect(() => {
    try {
      // Listen for auth state changes from Firebase
      const unsubscribe = db.onAuthChange((currentUser) => {
        setUser(currentUser);
        setInitializing(false);
        hasAttemptedAuth.current = true;
      });

      // Set initializing to false after a timeout to prevent infinite loading
      const timeout = setTimeout(() => {
        if (!hasAttemptedAuth.current) {
          setInitializing(false);
          setError('Unable to connect to authentication service. Please check your internet connection and Firebase configuration. Ensure environment variables are set in your deployment platform.');
        }
      }, 5000);

      // Cleanup subscription on unmount
      return () => {
        unsubscribe();
        clearTimeout(timeout);
      };
    } catch (err: any) {
      console.error('Firebase initialization error:', err);
      setInitializing(false);
      setError(`Failed to initialize authentication service: ${err.message}. Please check your Firebase configuration and ensure all environment variables are properly set in your deployment platform.`);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await db.logout();
      // User state update is handled by the onAuthChange listener
    } catch (err: any) {
      console.error('Logout error:', err);
      setError('Failed to logout. Please try again.');
    }
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-50"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-200 p-4">
        <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Application Error</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">Deployment Checklist:</h3>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 list-disc pl-5 space-y-1">
              <li><strong>Ensure environment variables are set in your deployment platform</strong> - This is likely the issue</li>
              <li>Verify Firebase project configuration in Firebase Console</li>
              <li>Check that Firestore database is created</li>
              <li>Confirm Firebase Authentication is enabled with Email/Password provider</li>
            </ul>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
              <p className="font-medium text-blue-800 dark:text-blue-200 mb-1">Environment Variables Needed:</p>
              <ul className="list-disc pl-5 text-blue-700 dark:text-blue-300">
                <li>VITE_FIREBASE_API_KEY</li>
                <li>VITE_FIREBASE_AUTH_DOMAIN</li>
                <li>VITE_FIREBASE_PROJECT_ID</li>
                <li>VITE_FIREBASE_STORAGE_BUCKET</li>
                <li>VITE_FIREBASE_MESSAGING_SENDER_ID</li>
                <li>VITE_FIREBASE_APP_ID</li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex-1"
            >
              Reload Application
            </button>
            <button 
              onClick={() => window.open('https://console.firebase.google.com/', '_blank')} 
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex-1"
            >
              Firebase Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  return user ? (
    <Dashboard user={user} onLogout={handleLogout} />
  ) : (
    <AuthForm onSuccess={() => {}} /> 
  );
};

// Note: onSuccess in AuthForm is now optional or handled by the auth listener, 
// but we pass an empty fn or refactor AuthForm to not rely solely on it for state.
// The listener in App.tsx will catch the login event.

export default App;