// Domain-specific API functions for user profile actions
import { User } from './user-types';
import { authGet, authPut } from '../auth/auth-api';

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
