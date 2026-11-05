import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { validateToken } from '../api/auth';
import { refreshAccessToken } from '../api/client';
import { getErrorDetail } from '../utils/error';
import { tokenStorage } from '../utils/tokenStorage';
import type { User } from '../types';

export interface Session {
  user: User;
  role: string;
}

const isTokenExpired = (token: string) => {
  try {
    const { exp } = jwtDecode(token);
    return !exp || exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export const loadSession = async (): Promise<Session | null> => {
  try {
    return await validateToken();
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status === 401 || status === 403) {
      tokenStorage.clearAccess();
    } else {
      console.error('ValidateToken failed:', getErrorDetail(error));
    }
    return null;
  }
};

export const restoreSession = async (): Promise<Session | null> => {
  const token = tokenStorage.getAccess();
  if (!token || isTokenExpired(token)) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      tokenStorage.clearAccess();
      return null;
    }
  }
  return loadSession();
};
