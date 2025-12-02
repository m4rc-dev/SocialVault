import { SocialAccount, User, ApiResponse } from '../types';

const STORAGE_KEYS = {
  USERS: 'socialvault_users',
  ACCOUNTS: 'socialvault_accounts',
  SESSION: 'socialvault_session',
};

// Helper to simulate network latency
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to hash passwords (SHA-256)
const hashPassword = async (password: string): Promise<string> => {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// --- Auth Services ---

export const login = async (email: string, password: string): Promise<ApiResponse<User>> => {
  await delay(600); // Simulate network
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];
  
  const hashedPassword = await hashPassword(password);
  const user = users.find(u => u.email === email && u.password === hashedPassword);
  
  if (user) {
    const sessionUser: User = { id: user.id, email: user.email, name: user.name };
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
    return { success: true, data: sessionUser };
  }
  
  return { success: false, error: 'Invalid credentials' };
};

export const register = async (email: string, password: string, name?: string): Promise<ApiResponse<User>> => {
  await delay(800);
  const usersStr = localStorage.getItem(STORAGE_KEYS.USERS);
  const users: any[] = usersStr ? JSON.parse(usersStr) : [];
  
  if (users.find(u => u.email === email)) {
    return { success: false, error: 'User already exists' };
  }
  
  const hashedPassword = await hashPassword(password);
  
  const newUser = {
    id: crypto.randomUUID(),
    email,
    password: hashedPassword,
    name: name || email.split('@')[0]
  };
  
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  
  const sessionUser: User = { id: newUser.id, email: newUser.email, name: newUser.name };
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionUser));
  
  return { success: true, data: sessionUser };
};

export const logout = async (): Promise<void> => {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
};

export const getSession = (): User | null => {
  const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
  return sessionStr ? JSON.parse(sessionStr) : null;
};

// --- Data Services ---

export const getAccounts = async (userId: string): Promise<SocialAccount[]> => {
  await delay(400);
  const accountsStr = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const allAccounts: SocialAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
  return allAccounts.filter(acc => acc.userId === userId).sort((a, b) => b.createdAt - a.createdAt);
};

export const createAccount = async (account: Omit<SocialAccount, 'id' | 'createdAt'>): Promise<SocialAccount> => {
  await delay(400);
  const accountsStr = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  const allAccounts: SocialAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
  
  const newAccount: SocialAccount = {
    ...account,
    id: crypto.randomUUID(),
    createdAt: Date.now(),
  };
  
  allAccounts.push(newAccount);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(allAccounts));
  return newAccount;
};

export const updateAccount = async (id: string, updates: Partial<SocialAccount>): Promise<SocialAccount> => {
  await delay(300);
  const accountsStr = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  let allAccounts: SocialAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
  
  const index = allAccounts.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Account not found');
  
  allAccounts[index] = { ...allAccounts[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(allAccounts));
  return allAccounts[index];
};

export const deleteAccount = async (id: string): Promise<void> => {
  await delay(300);
  const accountsStr = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  let allAccounts: SocialAccount[] = accountsStr ? JSON.parse(accountsStr) : [];
  
  allAccounts = allAccounts.filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(allAccounts));
};