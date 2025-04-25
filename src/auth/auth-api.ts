// Domain-specific API functions for authentication actions
import { User } from '../profile/user-types';
import { USER_KEY, JWT_TOKEN } from '../lib/storage-helpers';

export const API_BASE = import.meta.env.VITE_BACKEND_HOST;

export async function login(email: string, password: string): Promise<User | null> {
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
  const user: User = data.user;
  const token: string = data.token;
  localStorage.setItem(JWT_TOKEN, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  localStorage.removeItem(JWT_TOKEN);
  localStorage.removeItem(USER_KEY);
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

export async function signup(name: string, username: string, email: string, password: string): Promise<User> {
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
  const data = await response.json();
  return data.user;
}

/**
 * authFetch: fetch wrapper for authenticated endpoints.
 * Automatically attaches JWT token, refreshes on 401, and retries once.
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  const token = localStorage.getItem(JWT_TOKEN);
  const headers = new Headers(init.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  const reqInit = { ...init, headers };
  let response = await fetch(input, reqInit);
  if (response.status === 401 && retry) {
    try {
      await refreshAuth();
      return await authFetch(input, init, false);
    } catch {
      await logout();
    }
  }
  return response;
}

export function authGet(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});
  headers.set("ngrok-skip-browser-warning", "true");
  return authFetch(`${API_BASE}${path}`, { ...init, method: 'GET', headers });
}

export function authPost(path: string, body?: any, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, { ...init, method: 'POST', body: JSON.stringify(body) });
}

export function authPut(path: string, body?: any, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, { ...init, method: 'PUT', body: JSON.stringify(body) });
}

export function authDelete(path: string, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, { ...init, method: 'DELETE' });
}
