import React, { useEffect, useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, ExternalLink, Command, LayoutGrid, List as ListIcon, User, Moon, Sun, Lock, Eye, EyeOff, Copy, Check } from 'lucide-react';
import { User as UserType, SocialAccount } from '../types';
import * as db from '../services/db';
import { Button } from './ui/Button';
import { AccountModal } from './AccountModal';
import { Switch } from './ui/Switch';

interface DashboardProps {
  user: UserType;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<SocialAccount | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Password Visibility State
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // Apply Dark Mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const fetchAccounts = async () => {
    try {
      const data = await db.getAccounts(user.id);
      setAccounts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id]);

  const filteredAccounts = useMemo(() => {
    const lowerQuery = searchQuery.toLowerCase();
    return accounts.filter(acc => 
      acc.platform.toLowerCase().includes(lowerQuery) || 
      acc.username.toLowerCase().includes(lowerQuery) ||
      acc.note.toLowerCase().includes(lowerQuery)
    );
  }, [accounts, searchQuery]);

  const handleAdd = async (data: any) => {
    try {
      console.log('Creating account with data:', { ...data, userId: user.id });
      await db.createAccount({ ...data, userId: user.id });
      console.log('Account created successfully');
      await fetchAccounts();
    } catch (error: any) {
      console.error('Error adding account:', error);
      console.error('Error details:', error.message || error.code || error);
      // Show an error message to the user
      const errorMessage = error.message || error.code || 'Unknown error';
      alert(`Failed to add account: ${errorMessage}. Please try again.`);
      
      // If it's a Firebase error, suggest checking the configuration
      if (errorMessage.includes('service not available') || errorMessage.includes('permission')) {
        alert('Please check your Firebase configuration and security rules.');
      }
    }
  };

  const handleEdit = async (data: any) => {
    if (!editingAccount) return;
    await db.updateAccount(editingAccount.id, data);
    await fetchAccounts();
    setEditingAccount(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      await db.deleteAccount(id);
      await fetchAccounts();
    }
  };

  const togglePasswordVisibility = (id: string) => {
    const newSet = new Set(visiblePasswords);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setVisiblePasswords(newSet);
  };

  const copyPassword = (password: string, id: string) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openAddModal = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const openEditModal = (account: SocialAccount) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black flex flex-col font-sans text-gray-950 dark:text-gray-50 transition-colors duration-200">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-black/60 transition-colors duration-200">
        <div className="container mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gray-900 dark:bg-gray-50 rounded-md p-1 text-white dark:text-black transition-colors duration-200">
              <Command className="w-4 h-4" />
            </div>
            <span className="font-bold tracking-tight">SocialVault</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2 mr-2">
                 {isDarkMode ? <Moon size={14} className="text-gray-500" /> : <Sun size={14} className="text-gray-500" />}
                 <Switch checked={isDarkMode} onCheckedChange={setIsDarkMode} />
              </div>
              <div className="w-px h-4 bg-gray-200 dark:bg-gray-800 mx-1"></div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                 <User size={14} />
                 <span>{user.name}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
              Log out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-8">
        
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </div>
            <input 
              placeholder="Filter accounts..." 
              className="flex h-9 w-full rounded-md border border-gray-200 dark:border-gray-800 bg-transparent px-3 py-1 pl-9 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 text-gray-900 dark:text-gray-100"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex w-full sm:w-auto gap-2">
             <div className="hidden sm:flex bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-md border border-gray-200 dark:border-gray-800 items-center">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-gray-950 shadow-sm text-gray-900 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-sm transition-all ${viewMode === 'list' ? 'bg-white dark:bg-gray-950 shadow-sm text-gray-900 dark:text-gray-50' : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-50'}`}
              >
                <ListIcon size={16} />
              </button>
            </div>
            <Button onClick={openAddModal} size="sm" className="w-full sm:w-auto">
              <Plus size={16} className="mr-2" /> Add Account
            </Button>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4"></div>
              <div className="h-3 w-24 bg-gray-100 dark:bg-gray-900 rounded"></div>
            </div>
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-gray-200 dark:border-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No accounts found</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-6">
              {searchQuery ? 'Try adjusting your search query.' : 'You haven\'t added any accounts yet.'}
            </p>
            {!searchQuery && (
              <Button onClick={openAddModal} variant="outline" size="sm">
                Add Account
              </Button>
            )}
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {filteredAccounts.map((account) => (
              <div 
                key={account.id} 
                className={`group border border-gray-200 dark:border-gray-800 bg-white dark:bg-black text-gray-950 dark:text-gray-50 shadow-sm transition-all hover:border-gray-300 dark:hover:border-gray-700 rounded-lg ${viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center p-4' : 'flex flex-col p-5'}`}
              >
                <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6' : 'flex-1'}`}>
                  {/* Header/Title Section */}
                  <div className={`flex items-start justify-between ${viewMode === 'list' ? 'w-full sm:w-48 shrink-0' : 'mb-4'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-sm font-bold uppercase shrink-0 text-gray-900 dark:text-gray-100">
                        {account.platform.charAt(0)}
                      </div>
                      <div className="space-y-0.5">
                        <h3 className="font-semibold leading-none tracking-tight">{account.platform}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{account.username}</p>
                      </div>
                    </div>
                  </div>

                  {/* Body Section */}
                  <div className={`${viewMode === 'list' ? 'flex-1 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 w-full' : 'space-y-4'}`}>
                    
                    {/* Password Field (if exists) */}
                    {account.password && (
                      <div className={`relative group/pass flex items-center ${viewMode === 'list' ? 'shrink-0' : ''}`}>
                         <div className="flex items-center h-8 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-2 py-1 gap-2">
                           <Lock size={12} className="text-gray-400" />
                           <span className="text-xs font-mono w-24 truncate text-gray-600 dark:text-gray-300">
                             {visiblePasswords.has(account.id) ? account.password : '••••••••'}
                           </span>
                           <div className="flex items-center border-l border-gray-200 dark:border-gray-700 pl-1 ml-1 gap-0.5">
                             <button 
                               onClick={() => togglePasswordVisibility(account.id)}
                               className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors"
                               title={visiblePasswords.has(account.id) ? "Hide" : "Show"}
                             >
                               {visiblePasswords.has(account.id) ? <EyeOff size={12} /> : <Eye size={12} />}
                             </button>
                             <button 
                               onClick={() => copyPassword(account.password!, account.id)}
                               className="p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 rounded transition-colors"
                               title="Copy password"
                             >
                               {copiedId === account.id ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                             </button>
                           </div>
                         </div>
                      </div>
                    )}

                    {/* Note section */}
                    <div className={`text-sm text-gray-500 dark:text-gray-400 ${viewMode === 'list' ? 'flex-1 truncate m-0' : 'line-clamp-2 min-h-[1.5rem]'}`}>
                      {account.note || <span className="italic text-gray-300 dark:text-gray-700 text-xs">No notes</span>}
                    </div>

                    {/* Link Section */}
                    <div className={`${viewMode === 'list' ? 'shrink-0' : 'pt-2'}`}>
                      {account.profileUrl ? (
                        <a 
                          href={account.profileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs font-medium text-gray-900 dark:text-gray-100 hover:underline"
                        >
                          Visit Profile <ExternalLink size={10} className="ml-1" />
                        </a>
                      ) : (
                         <span className="text-xs text-gray-400 dark:text-gray-600">No link</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className={`flex justify-end gap-1 ${viewMode === 'list' ? 'mt-4 sm:mt-0 sm:ml-4 sm:pl-4 sm:border-l border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100 dark:border-gray-800' : 'mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'}`}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    onClick={() => openEditModal(account)}
                    title="Edit"
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={() => handleDelete(account.id)}
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AccountModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={editingAccount ? handleEdit : handleAdd}
          initialData={editingAccount}
        />
      </main>
    </div>
  );
};