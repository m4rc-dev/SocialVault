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
          setError('Unable to connect to authentication service. Please check your internet connection and Firebase configuration.');
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
      setError('Failed to initialize authentication service. Please check your Firebase configuration.');
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
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reload Application
          </button>
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