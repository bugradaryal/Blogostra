import type { AxiosResponse } from 'axios';

export interface AuthTokens {
  authorization: string;
  refreshToken: string;
}

export const readTokens = ({ headers }: AxiosResponse): AuthTokens | null => {
  const authorization = headers['authorization'];
  const refreshToken = headers['refreshtoken'];
  return typeof authorization === 'string' && typeof refreshToken === 'string'
    ? { authorization, refreshToken }
    : null;
};
