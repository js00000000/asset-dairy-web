import { User } from './user-types';
import api from '@/lib/api';

async function fetchProfile(): Promise<User | null> {
  try {
    const res = await api.get<User>('/profile');
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to fetch user profile');
  }
}

async function updateProfile(data: Partial<User>): Promise<User> {
  try {
    const res = await api.put<User>('/profile', data);
    return res.data;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || 'Failed to update profile');
  }
}

async function deleteProfile(): Promise<boolean> {
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

export const profileApi = {
  fetchProfile,
  updateProfile,
  deleteProfile,
};