import { createContext } from 'react';
import type { User } from '../types';

export interface AuthContextValue {
  user: User | null;
  role: string;
  isLoading: boolean;
  refreshUser: () => Promise<boolean>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
