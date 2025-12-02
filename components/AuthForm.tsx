import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import * as db from '../services/db';
import { User } from '../types';

interface AuthFormProps {
  onSuccess: (user: User) => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // The onAuthChange listener in App.tsx will handle the state update
      // We just need to trigger the firebase auth action here.
      const res = isLogin 
        ? await db.login(email, password)
        : await db.register(email, password, name);

      if (!res.success) {
        setError(res.error || 'Authentication failed');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-black p-4 transition-colors duration-200">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {isLogin ? 'Enter your credentials to access your vault.' : 'Enter your email below to create your account.'}
          </p>
        </div>

        <div className="grid gap-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              {!isLogin && (
                <div className="grid gap-1">
                  <Input
                    label="Name"
                    placeholder="John Doe"
                    type="text"
                    autoCapitalize="none"
                    autoCorrect="off"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              )}
              <div className="grid gap-1">
                <Input
                  label="Email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-1">
                <Input
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              {error && (
                <div className="text-sm text-red-500 font-medium">
                  {error}
                </div>
              )}

              <Button type="submit" isLoading={isLoading} className="w-full mt-2">
                {isLogin ? 'Sign In' : 'Sign Up with Email'}
              </Button>
            </div>
          </form>
        </div>

        <p className="px-8 text-center text-sm text-gray-500 dark:text-gray-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="underline underline-offset-4 hover:text-primary-900 dark:hover:text-gray-100 font-medium text-gray-900 dark:text-gray-100"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
};