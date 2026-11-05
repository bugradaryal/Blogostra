import axios, { type InternalAxiosRequestConfig } from 'axios';
import { readTokens } from './tokens';
import { tokenStorage } from '../utils/tokenStorage';

const config = {
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
};

export const api = axios.create(config);

export const authApi = axios.create(config);

type RetriableRequest = InternalAxiosRequestConfig & { retried?: boolean };

let pendingRefresh: Promise<string | null> | null = null;
let sessionExpiredHandler: (() => void) | null = null;

export const setSessionExpiredHandler = (handler: (() => void) | null) => {
  sessionExpiredHandler = handler;
};

const requestNewTokens = async () => {
  const refreshToken = tokenStorage.getRefresh();
  if (!refreshToken) return null;

  try {
    const response = await api.post(
      '/Auth/RefreshToken',
      {},
      { headers: { RefreshToken: refreshToken } },
    );
    const tokens = readTokens(response);
    if (!tokens) return null;

    tokenStorage.set(tokens.authorization, tokens.refreshToken);
    return tokens.authorization;
  } catch (error) {
    const status = axios.isAxiosError(error) ? error.response?.status : undefined;
    if (status && status < 500) {
      tokenStorage.clear();
    }
    return null;
  }
};

export const refreshAccessToken = () => {
  pendingRefresh ??= requestNewTokens().finally(() => {
    pendingRefresh = null;
  });
  return pendingRefresh;
};

authApi.interceptors.request.use((request) => {
  const token = tokenStorage.getAccess();
  if (token) {
    request.headers.Authorization = token;
  }
  return request;
});

authApi.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401 || !error.config) {
      return Promise.reject(error);
    }

    const request: RetriableRequest = error.config;
    if (request.retried) {
      return Promise.reject(error);
    }
    request.retried = true;

    const token = await refreshAccessToken();
    if (!token) {
      tokenStorage.clearAccess();
      sessionExpiredHandler?.();
      return Promise.reject(error);
    }

    request.headers.Authorization = token;
    return authApi(request);
  },
);
