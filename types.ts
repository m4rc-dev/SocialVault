export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface SocialAccount {
  id: string;
  userId: string;
  platform: string;
  username: string;
  password?: string;
  profileUrl?: string;
  note: string;
  createdAt: number;
}

export type AuthState = 'login' | 'register' | 'authenticated';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}