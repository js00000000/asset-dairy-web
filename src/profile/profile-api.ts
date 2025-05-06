// Domain-specific API functions for user profile actions
import { User } from './user-types';
import api from '@/lib/api';

export async function fetchProfile(): Promise<User | null> {
  try {
    const res = await api.get<User>('/profile');
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch user profile');
  }
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const res = await api.put<User>('/profile', data);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update profile');
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  try {
    await api.post('/profile/change-password', { currentPassword, newPassword });
  } catch (err: any) {
    let errMsg = 'Change password failed';
    if (err.response?.data?.message) errMsg = err.response.data.message;
    throw new Error(errMsg);
  }
}

export async function deleteProfile(): Promise<boolean> {
  try {
    // Assuming your API returns a 200 OK or 204 No Content on successful deletion
    const response = await api.delete('/profile');
    // Check if the status code indicates success
    return response.status === 200 || response.status === 204;
  } catch (err: any) {
    console.error('Failed to delete user account:', err);
    // Optionally, you could throw a more specific error or re-throw the original
    throw new Error(err?.response?.data?.message || 'Failed to delete account');
  }
}
