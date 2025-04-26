// Domain-specific API functions for authentication actions
import { JWT_TOKEN } from '../lib/storage-helpers';

export const API_BASE = import.meta.env.VITE_BACKEND_HOST;

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errMsg = 'Login failed';
    try {
      const data = await response.json();
      errMsg = data.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  const token: string = data.token;
  localStorage.setItem(JWT_TOKEN, token);
}

export async function logout(): Promise<void> {
  localStorage.removeItem(JWT_TOKEN);
}

export async function refreshAuth(): Promise<string> {
  const token = localStorage.getItem(JWT_TOKEN);
  if (!token) throw new Error('No token');
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) throw new Error('Failed to refresh token');
  const data = await response.json();
  localStorage.setItem(JWT_TOKEN, data.token);
  return data.token;
}

export async function signup(name: string, username: string, email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/sign-up`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, username, email, password }),
  });
  if (!response.ok) {
    let errMsg = 'Signup failed';
    try {
      const data = await response.json();
      errMsg = data.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }
}