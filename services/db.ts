import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  doc,
  orderBy 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { SocialAccount, User, ApiResponse } from '../types';

const ACCOUNTS_COLLECTION = 'social_accounts';

// --- Auth Services ---

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      callback({
        id: firebaseUser.uid,
        email: firebaseUser.email!,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0]
      });
    } else {
      callback(null);
    }
  });
};

export const login = async (email: string, password: string): Promise<ApiResponse<User>> => {
  // Check if auth is initialized
  if (!auth) {
    return { success: false, error: 'Authentication service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.' };
  }
  
  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return { 
      success: true, 
      data: { 
        id: cred.user.uid, 
        email: cred.user.email!, 
        name: cred.user.displayName || undefined 
      } 
    };
  } catch (error: any) {
    return { success: false, error: formatAuthError(error.code) };
  }
};

export const register = async (email: string, password: string, name?: string): Promise<ApiResponse<User>> => {
  // Check if auth is initialized
  if (!auth) {
    return { success: false, error: 'Authentication service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.' };
  }
  
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (name) {
      await updateProfile(cred.user, { displayName: name });
    }
    return { 
      success: true, 
      data: { 
        id: cred.user.uid, 
        email: cred.user.email!, 
        name: name || cred.user.email?.split('@')[0] 
      } 
    };
  } catch (error: any) {
    return { success: false, error: formatAuthError(error.code) };
  }
};

export const logout = async (): Promise<void> => {
  // Check if auth is initialized
  if (!auth) {
    throw new Error('Authentication service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.');
  }
  
  await signOut(auth);
};

// --- Data Services ---

export const getAccounts = async (userId: string): Promise<SocialAccount[]> => {
  // Check if db is initialized
  if (!db) {
    console.error('Database service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.');
    return [];
  }
  
  try {
    console.log('Fetching accounts for user:', userId);
    const q = query(
      collection(db, ACCOUNTS_COLLECTION), 
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const accounts: SocialAccount[] = [];
    querySnapshot.forEach((doc) => {
      accounts.push({ id: doc.id, ...doc.data() } as SocialAccount);
    });
    console.log('Fetched accounts:', accounts);
    // Client-side sort to avoid complex compound index requirement immediately
    return accounts.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error: any) {
    console.error("Error fetching accounts:", error);
    console.error("Error details:", error.message || error.code || error);
    return [];
  }
};

export const createAccount = async (account: Omit<SocialAccount, 'id' | 'createdAt'>): Promise<SocialAccount> => {
  // Check if db is initialized
  if (!db) {
    throw new Error('Database service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.');
  }
  
  const newAccountData = {
    ...account,
    createdAt: Date.now(),
  };
  
  console.log('Creating account in Firestore:', newAccountData);
  try {
    const docRef = await addDoc(collection(db, ACCOUNTS_COLLECTION), newAccountData);
    console.log('Account created with ID:', docRef.id);
    return { id: docRef.id, ...newAccountData };
  } catch (error: any) {
    console.error('Error creating account in Firestore:', error);
    throw error;
  }
};

export const updateAccount = async (id: string, updates: Partial<SocialAccount>): Promise<SocialAccount> => {
  // Check if db is initialized
  if (!db) {
    throw new Error('Database service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.');
  }
  
  const docRef = doc(db, ACCOUNTS_COLLECTION, id);
  // Remove id from updates if present to avoid overwriting document key with field
  const { id: _, ...safeUpdates } = updates;
  await updateDoc(docRef, safeUpdates);
  return { id, ...updates } as SocialAccount; // Optimistic return
};

export const deleteAccount = async (id: string): Promise<void> => {
  // Check if db is initialized
  if (!db) {
    throw new Error('Database service not available. Please check your Firebase configuration. Ensure all environment variables (VITE_FIREBASE_API_KEY, etc.) are properly set in your deployment platform.');
  }
  
  await deleteDoc(doc(db, ACCOUNTS_COLLECTION, id));
};

// Helper
const formatAuthError = (code: string): string => {
  switch (code) {
    case 'auth/email-already-in-use': return 'Email is already in use.';
    case 'auth/invalid-email': return 'Invalid email address.';
    case 'auth/user-not-found':
    case 'auth/wrong-password': return 'Invalid email or password.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    default: return 'Authentication failed. Please try again.';
  }
};