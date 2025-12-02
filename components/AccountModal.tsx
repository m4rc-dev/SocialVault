import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { SocialAccount } from '../types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (account: Omit<SocialAccount, 'id' | 'createdAt' | 'userId'>) => Promise<void>;
  initialData?: SocialAccount | null;
}

export const AccountModal: React.FC<AccountModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [platform, setPlatform] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [profileUrl, setProfileUrl] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (initialData) {
      setPlatform(initialData.platform);
      setUsername(initialData.username);
      setPassword(initialData.password || '');
      setProfileUrl(initialData.profileUrl);
      setNote(initialData.note);
    } else {
      setPlatform('');
      setUsername('');
      setPassword('');
      setProfileUrl('');
      setNote('');
    }
    setShowPassword(false);
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Sanitize URL
    let safeUrl = profileUrl.trim();
    if (safeUrl && !/^https?:\/\//i.test(safeUrl)) {
      // Only add https:// if the URL doesn't already have a protocol and is not empty
      if (safeUrl) {
        safeUrl = `https://${safeUrl}`;
      }
    }

    const accountData = { 
      platform, 
      username, 
      password: password.trim(), 
      profileUrl: safeUrl, 
      note 
    };
    console.log('Submitting account data:', accountData);
    try {
      await onSubmit(accountData);
      console.log('Account submitted successfully');
      onClose();
    } catch (error: any) {
      console.error('Error submitting account:', error);
      console.error('Error details:', error.message || error.code || error);
      alert(`Failed to save account: ${error.message || error.code || 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-gray-900 text-gray-950 dark:text-gray-50 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="flex flex-col space-y-1.5 p-6 pb-4">
           <div className="flex items-center justify-between">
              <h3 className="font-semibold leading-none tracking-tight text-lg">
                {initialData ? 'Edit Account' : 'New Account'}
              </h3>
              <button 
                onClick={onClose} 
                className="rounded-md opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-gray-100 dark:data-[state=open]:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-100"
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </button>
           </div>
           <p className="text-sm text-gray-500 dark:text-gray-400">
             {initialData ? 'Update your account details below.' : 'Add the details of the social account you want to track.'}
           </p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 pt-0 space-y-4">
          <Input
            label="Platform"
            placeholder="e.g. GitHub"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            required
            autoFocus
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Username"
              placeholder="@johndoe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Optional"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              rightElement={
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="hover:text-gray-900 dark:hover:text-gray-50 focus:outline-none transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              }
            />
          </div>
          
          <Input
            label="Profile URL"
            type="url"
            placeholder="https://github.com/johndoe"
            value={profileUrl}
            onChange={(e) => setProfileUrl(e.target.value)}
          />
          
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900 dark:text-gray-100">
              Notes
            </label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:placeholder:text-gray-500 dark:focus-visible:ring-gray-300 dark:text-gray-50"
              placeholder="Add any extra details here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {initialData ? 'Save Changes' : 'Create Account'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};