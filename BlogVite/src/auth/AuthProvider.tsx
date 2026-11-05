import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { setSessionExpiredHandler } from '../api/client';
import { tokenStorage } from '../utils/tokenStorage';
import { AuthContext } from './AuthContext';
import { loadSession, restoreSession, type Session } from './session';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  role: string;
  isLoading: boolean;
}

const toState = (session: Session | null): AuthState => ({
  user: session?.user ?? null,
  role: session?.role ?? '',
  isLoading: false,
});

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [state, setState] = useState<AuthState>({ user: null, role: '', isLoading: true });

  const signOut = useCallback(() => {
    tokenStorage.clear();
    queryClient.clear();
    setState(toState(null));
  }, [queryClient]);

  const refreshUser = useCallback(async () => {
    const session = await loadSession();
    if (session) setState(toState(session));
    return session !== null;
  }, []);

  useEffect(() => {
    let ignore = false;
    restoreSession().then((session) => {
      if (!ignore) setState(toState(session));
    });
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    setSessionExpiredHandler(signOut);
    return () => setSessionExpiredHandler(null);
  }, [signOut]);

  const value = useMemo(() => ({ ...state, refreshUser, signOut }), [state, refreshUser, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
