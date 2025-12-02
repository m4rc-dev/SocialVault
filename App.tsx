import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { AuthForm } from './components/AuthForm';
import { User } from './types';
import * as db from './services/db';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Listen for auth state changes from Firebase
    const unsubscribe = db.onAuthChange((currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await db.logout();
    // User state update is handled by the onAuthChange listener
  };

  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black transition-colors duration-200">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-50"></div>
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