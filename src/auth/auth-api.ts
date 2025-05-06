// Domain-specific API functions for authentication actions
import { ACCESS_TOKEN } from '@/lib/storage-helpers';
import api, { apiNoAuth } from '@/lib/api';

export const API_BASE = import.meta.env.VITE_BACKEND_HOST;

export async function login(email: string, password: string): Promise<string> {
  try {
    const response = await apiNoAuth.post(`/auth/sign-in`, { email, password });
    const token: string = response.data.token;
    return token;
  } catch (error: any) {
    let errMsg = 'Login failed';
    if (error.response?.data?.message) {
      errMsg = error.response.data.message;
    }
    throw new Error(errMsg);
  }
}

export async function logout(): Promise<void> {
  try {
    await api.post('/auth/logout', {}, { withCredentials: true });
  } catch (error: any) {
    console.error('Logout failed:', error);
  }
  localStorage.removeItem(ACCESS_TOKEN);
}

export async function signup(name: string, username: string, email: string, password: string): Promise<string> {
  try {
    const response = await apiNoAuth.post(`/auth/sign-up`, { name, username, email, password });
    const token: string = response.data.token;
    return token;
  } catch (error: any) {
    let errMsg = 'Signup failed';
    if (error.response?.data?.message) {
      errMsg = error.response.data.message;
    }
    throw new Error(errMsg);
  }
}

/**
 * Attempts to refresh the access token using the refresh token stored in cookie.
 * On success, stores the new access token in localStorage.
 * Throws error if refresh fails.
 */
export async function refreshAccessToken(): Promise<string> {
  try {
    const response = await apiNoAuth.post('/auth/refresh', {}, { withCredentials: true });
    return response.data.token;
  } catch (error: any) {
    throw new Error('Session expired. Please log in again.');
  }
}