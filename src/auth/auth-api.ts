// Domain-specific API functions for authentication actions
import { ACCESS_TOKEN } from '../lib/storage-helpers';

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
  localStorage.setItem(ACCESS_TOKEN, token);
}

export async function logout(): Promise<void> {
  localStorage.removeItem(ACCESS_TOKEN);
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