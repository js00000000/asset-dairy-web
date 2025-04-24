// Domain-specific API functions for user profile actions
import { User } from './user-types';
import { authGet, authPost, authPut } from '../auth/auth-api';

export async function fetchProfile(): Promise<User | null> {
  const res = await authGet('/profile');
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return await res.json();
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  const res = await authPut('/profile', data);
  if (!res.ok) throw new Error('Failed to update profile');
  return await res.json();
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const res = await authPost('/profile/change-password', { currentPassword, newPassword });
  if (!res.ok) {
    let errMsg = 'Change password failed';
    try {
      const data = await res.json();
      errMsg = data.message || errMsg;
    } catch { }
    throw new Error(errMsg);
  }
}

