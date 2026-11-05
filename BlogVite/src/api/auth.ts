import { api, authApi } from './client';
import { readTokens } from './tokens';
import type { User } from '../types';

export interface RegisterData {
  Name: string;
  Surname: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  Address: string;
  Password: string;
}

export const login = async (email: string, password: string) =>
  readTokens(await api.post('/Auth/Login', { email, password }));

export const register = (data: RegisterData) => api.post('/Auth/Register', data);

export const sendVerificationMail = (email: string) => api.post('/Auth/SendMail', email);

export const verifyEmail = (userId: string, emailConfUrl: string) =>
  api.post('/Auth/Emailverification', { userId, emailConfUrl });

export const validateToken = async () => {
  const { data } = await authApi.post('/Auth/ValidateToken', {});
  const user: User = {
    Id: data.user.id,
    UserName: data.user.userName,
    Email: data.user.email,
    Name: data.user.name,
    SurName: data.user.surname,
    PhoneNumber: data.user.phoneNumber,
    Address: data.user.address,
  };
  return { user, role: data.role as string };
};
