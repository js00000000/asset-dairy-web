// Domain-specific API functions for user/profile/auth actions
// Extracted from services/api.ts

import { User } from './user-types';
import { USER_KEY, JWT_TOKEN } from '../lib/storage-helpers';

const API_BASE = 'http://localhost:3000';

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

export async function login(email: string, password: string): Promise<User | null> {
  const response = await fetch(`${API_BASE}/auth/sign-in`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    // Attempt to parse error message from backend
    let errMsg = 'Login failed';
    try {
      const data = await response.json();
      errMsg = data.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const data = await response.json();
  // data: { token: string, user: User }
  const user: User = data.user;
  const token: string = data.token;
  // Store JWT token for auth
  localStorage.setItem(JWT_TOKEN, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
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
      // Try again with new token
      const newToken = localStorage.getItem(JWT_TOKEN);
      if (newToken) headers.set('Authorization', `Bearer ${newToken}`);
      response = await fetch(input, { ...init, headers });
    } catch (e) {
      // Refresh failed, clear auth state
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(JWT_TOKEN);
      throw new Error('Session expired. Please sign in again.');
    }
  }
  return response;
}

/**
 * authGet: authenticated GET request. Pass path (no host, must start with /)
 * Example: authGet('/accounts')
 */
export async function authGet(path: string, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, { ...init, method: 'GET', credentials: 'include' });
}

/**
 * authPost: authenticated POST request. Pass path (no host, must start with /)
 * Example: authPost('/accounts', { name: '...', ... })
 */
export async function authPost(path: string, body?: any, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, {
    ...init,
    method: 'POST',
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * authPut: authenticated PUT request. Pass path (no host, must start with /)
 * Example: authPut('/accounts/123', { name: 'New Name' })
 */
export async function authPut(path: string, body?: any, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, {
    ...init,
    method: 'PUT',
    credentials: 'include',
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
}

/**
 * authDelete: authenticated DELETE request. Pass path (no host, must start with /)
 * Example: authDelete('/accounts/123')
 */
export async function authDelete(path: string, init: RequestInit = {}): Promise<Response> {
  return authFetch(`${API_BASE}${path}`, {
    ...init,
    method: 'DELETE',
    credentials: 'include',
  });
}


export async function logout(): Promise<void> {
  // Call backend logout endpoint using authFetch
  try {
    await authFetch(`${API_BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch (e) {
    // Ignore network errors for logout
  }
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(JWT_TOKEN);
}

export async function refreshAuth(): Promise<string> {
  // Call backend refresh endpoint, expect { token }
  const response = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }
  const data = await response.json();
  const token: string = data.token;
  localStorage.setItem(JWT_TOKEN, token);
  return token;
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
    // Attempt to parse error message from backend
    let errMsg = 'Signup failed';
    try {
      const data = await response.json();
      errMsg = data.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const user: User = await response.json();
  return user;
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<User> {
  await new Promise(res => setTimeout(res, 400));
  const userRaw = localStorage.getItem(USER_KEY);
  if (!userRaw) throw new Error('Not authenticated');
  const user = JSON.parse(userRaw);
  if (!user.password || user.password !== currentPassword) {
    throw new Error('Current password is incorrect');
  }
  const updated = { ...user, password: newPassword };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
}
