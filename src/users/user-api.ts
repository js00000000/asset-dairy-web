// Domain-specific API functions for user/profile/auth actions
// Extracted from services/api.ts

import { User } from './user-types';
import { USER_KEY } from '../lib/storage-helpers';


export async function fetchProfile(): Promise<User | null> {
  await new Promise(res => setTimeout(res, 300));
  const user = localStorage.getItem(USER_KEY);
  if (!user) return null;
  const parsed = JSON.parse(user);
  // Ensure investmentProfile is present if it exists
  return {
    ...parsed,
    investmentProfile: parsed.investmentProfile ?? undefined,
  };
}

export async function updateProfile(data: Partial<User>): Promise<User> {
  await new Promise(res => setTimeout(res, 300));
  const current = localStorage.getItem(USER_KEY);
  const prev = JSON.parse(current || '{}');
  // Deep merge investmentProfile if present
  let updated = { ...prev, ...data };
  if (data.investmentProfile) {
    updated.investmentProfile = { ...prev.investmentProfile, ...data.investmentProfile };
  }
  localStorage.setItem(USER_KEY, JSON.stringify(updated));

  // --- Also update local_users array if user exists ---
  const localUsersRaw = localStorage.getItem('local_users');
  if (localUsersRaw) {
    let localUsers = JSON.parse(localUsersRaw);
    const idx = localUsers.findIndex((u: any) => u.id === updated.id);
    if (idx !== -1) {
      // Merge investmentProfile for the matched user
      localUsers[idx] = {
        ...localUsers[idx],
        ...data,
        investmentProfile: {
          ...localUsers[idx].investmentProfile,
          ...data.investmentProfile,
        },
      };
      localStorage.setItem('local_users', JSON.stringify(localUsers));
    }
  }
  // --- End local_users update ---

  return updated;
}

export async function login(email: string, password: string): Promise<User | null> {
  const response = await fetch('http://localhost:3000/auth/sign-in', {
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
  // Future: store data.token for auth
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export async function logout(): Promise<void> {
  await new Promise(res => setTimeout(res, 200));
  localStorage.removeItem(USER_KEY);
}

export async function signup(name: string, username: string, email: string, password: string): Promise<User> {
  const response = await fetch('http://localhost:3000/auth/sign-up', {
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
