import { authApi } from './client';
import type { User } from '../types';

export const deleteAccount = (userId: string) =>
  authApi.delete('/User/DeleteAccount', { data: userId });

export const updateAccount = (user: User) => authApi.put('/User/UpdateAccount', user);

interface PasswordChange {
  userId: string;
  oldPassword: string;
  newPassword: string;
}

export const changePassword = ({ userId, oldPassword, newPassword }: PasswordChange) =>
  authApi.put('/User/ChangePassword', {
    user_id: userId,
    oldpassword: oldPassword,
    newpassword: newPassword,
  });
