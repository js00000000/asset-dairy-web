// Domain-specific API functions for authentication actions
import { ACCESS_TOKEN } from '../lib/storage-helpers';
import { apiNoAuth } from '../lib/api';

export const API_BASE = import.meta.env.VITE_BACKEND_HOST;

export async function login(email: string, password: string): Promise<void> {
  try {
    const response = await apiNoAuth.post(`/auth/sign-in`, { email, password });
    const token: string = response.data.token;
    localStorage.setItem(ACCESS_TOKEN, token);
  } catch (error: any) {
    let errMsg = 'Login failed';
    if (error.response?.data?.message) {
      errMsg = error.response.data.message;
    }
    throw new Error(errMsg);
  }
}

export async function logout(): Promise<void> {
  localStorage.removeItem(ACCESS_TOKEN);
}

export async function signup(name: string, username: string, email: string, password: string): Promise<void> {
  try {
    await apiNoAuth.post(`/auth/sign-up`, { name, username, email, password });
  } catch (error: any) {
    let errMsg = 'Signup failed';
    if (error.response?.data?.message) {
      errMsg = error.response.data.message;
    }
    throw new Error(errMsg);
  }
}